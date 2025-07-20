const { Op } = require('sequelize');
const fs = require('fs').promises;

const Event = require('../models/Event');
const User = require('../models/User');
const Category = require('../models/Category');

const AppError = require('../errors/AppError');
const uploadConfig = require('../../config/upload');

/**
 * Lida com toda a lógica de negócio relacionada a eventos.
 */
class EventService {
  async getById(eventId) {
    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'attendees',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!event) {
      throw new AppError('Event not found.', 404);
    }

    return event;
  }

  async getAll(query) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      order = 'ASC',
      location,
      time = 'future',
      categoryId,
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

    const include = [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    ];

    if (categoryId) {
      include[1].where = { id: categoryId };
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include,
      distinct: true,
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

  async create(eventData, userId) {
    const { categoryIds, ...restOfEventData } = eventData;

    const event = await Event.create({ ...restOfEventData, user_id: userId });

    if (categoryIds && categoryIds.length > 0) {
      await event.setCategories(categoryIds);
    }

    return event;
  }

  async update(eventId, updateData, userId, isAdmin) {
    const { categoryIds, ...restOfUpdateData } = updateData;
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

    await event.update(restOfUpdateData);

    if (categoryIds) {
      await event.setCategories(categoryIds);
    }

    return event;
  }

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
