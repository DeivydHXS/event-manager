const { Op } = require('sequelize');
const Event = require('../models/Event');
const User = require('../models/User');
const AppError = require('../errors/AppError');
const fs = require('fs').promises;
const uploadConfig = require('../../config/upload');

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

  async create(eventData, userId) {
    const event = await Event.create({ ...eventData, user_id: userId });
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
