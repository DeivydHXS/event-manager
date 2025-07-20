const Yup = require('yup');
const EventService = require('../services/EventService');

class EventController {
  async index(req, res) {
    const result = await EventService.getAll(req.query);
    return res.json(result);
  }

  async show(req, res) {
    const { id } = req.params;
    const event = await EventService.getById(id);
    return res.json(event);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      location: Yup.string().required(),
    });
    await schema.validate(req.body, { abortEarly: false });

    const event = await EventService.create(req.body, req.userId);
    return res.status(201).json(event);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      date: Yup.date(),
      location: Yup.string(),
    });
    await schema.validate(req.body, { abortEarly: false });

    const event = await EventService.update(
      req.params.id,
      req.body,
      req.userId,
      req.isAdmin
    );
    return res.json(event);
  }

  async updateImage(req, res) {
    const updatedEvent = await EventService.updateImage(
      req.params.id,
      req.file.filename,
      req.userId,
      req.isAdmin
    );

    return res.json(updatedEvent);
  }

  async delete(req, res) {
    await EventService.delete(req.params.id, req.userId, req.isAdmin);
    return res.status(204).send();
  }
}

module.exports = new EventController();
