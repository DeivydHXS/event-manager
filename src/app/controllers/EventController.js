const Yup = require('yup');
const { Op } = require('sequelize');
const Event = require('../models/Event');
const User = require('../models/User');

class EventController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      location: Yup.string().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const { name, description, date, location } = req.body;
    const { userId } = req;

    const event = await Event.create({
      name,
      description,
      date,
      location,
      user_id: userId,
    });
    return res.status(201).json(event);
  }

  async index(req, res) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      order = 'ASC',
      location,
      time = 'future',
    } = req.query;

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
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json({
      events: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  }

  async show(req, res) {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        {
          model: User,
          as: 'attendees',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    return res.json(event);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      date: Yup.date(),
      location: Yup.string(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (event.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to do this." });
    }

    const updatedEvent = await event.update(req.body);
    return res.json(updatedEvent);
  }

  async delete(req, res) {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    await event.destroy();
    return res.status(204).send();
  }
}

module.exports = new EventController();
