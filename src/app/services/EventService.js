const { Op } = require('sequelize');
const Event = require('../models/Event');
const User = require('../models/User');
const AppError = require('../errors/AppError');
const fs = require('fs').promises;
const uploadConfig = require('../../config/upload');

class EventService {
  /**
   * Busca um único evento pelo seu ID, incluindo o criador e os participantes.
   * @param {number} eventId - O ID do evento.
   * @returns {Promise<Event>} - O objeto do evento.
   */
  async getById(eventId) {
    const event = await Event.findByPk(eventId, {
      // Incluímos os dados relacionados para uma resposta mais completa
      include: [
        {
          model: User,
          as: 'creator', // Alias definido na associação do modelo
          attributes: ['id', 'name', 'email'], // Apenas os campos seguros
        },
        {
          model: User,
          as: 'attendees', // Alias definido na associação do modelo
          attributes: ['id', 'name'],
          through: { attributes: [] }, // Oculta os dados da tabela de junção
        },
      ],
    });

    // Se o evento não for encontrado, lançamos um erro que será capturado pelo nosso exceptionHandler.
    if (!event) {
      throw new AppError('Event not found.', 404);
    }

    return event;
  }

  /**
   * Lista todos os eventos com base em filtros, paginação e ordenação.
   * @param {object} query - Os query parameters da requisição (page, limit, etc.).
   * @returns {Promise<object>} - Um objeto com os eventos e metadados de paginação.
   */
  async getAll(query) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      order = 'ASC',
      location,
      time = 'future',
    } = query;

    const where = {};
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }
    if (time === 'future') {
      where.date = { [Op.gte]: new Date() };
    } else if (time === 'past') {
      where.date = { [Op.lt]: new Date() };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    });

    return {
      events: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    };
  }

  /**
   * Cria um novo evento.
   * @param {object} eventData - Os dados do evento a ser criado.
   * @param {number} userId - O ID do usuário que está a criar o evento.
   * @returns {Promise<Event>} - O evento recém-criado.
   */
  async create(eventData, userId) {
    const event = await Event.create({ ...eventData, user_id: userId });
    return event;
  }

  /**
   * Atualiza a imagem de um evento.
   * @param {number} eventId - O ID do evento.
   * @param {string} imageFilename - O nome do novo ficheiro da imagem.
   * @param {number} userId - O ID do usuário que está a realizar a ação.
   * @param {boolean} isAdmin - Se o usuário é um administrador.
   * @returns {Promise<Event>} - O evento atualizado.
   */
  async updateImage(eventId, imageFilename, userId, isAdmin) {
    const event = await Event.findByPk(eventId);

    if (!event) {
      throw new AppError('Event not found.', 404);
    }

    if (event.user_id !== userId && !isAdmin) {
      throw new AppError(
        'Forbidden: You do not have permission to perform this action.',
        403
      );
    }

    if (event.image_path) {
      const oldImagePath = path.join(uploadConfig.directory, event.image_path);
      try {
        await fs.access(oldImagePath);
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error('Old image file not found, continuing...', error);
      }
    }

    event.image_path = imageFilename;
    await event.save();

    return event;
  }

  /**
   * Exclui um evento.
   * @param {number} eventId - O ID do evento a ser excluído.
   * @param {number} userId - O ID do usuário que está a realizar a ação.
   * @param {boolean} isAdmin - Se o usuário é um administrador.
   */
  async delete(eventId, userId, isAdmin) {
    const event = await Event.findByPk(eventId);

    if (!event) {
      throw new AppError('Event not found.', 404);
    }

    if (event.user_id !== userId && !isAdmin) {
      throw new AppError(
        'Forbidden: You do not have permission to perform this action.',
        403
      );
    }

    await event.destroy();
  }
}

module.exports = new EventService();
