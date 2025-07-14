// src/app/controllers/SessionController.js

const Yup = require('yup');
const SessionService = require('../services/SessionService');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });
    await schema.validate(req.body, { abortEarly: false });

    const session = await SessionService.create(req.body);

    return res.json(session);
  }
}

module.exports = new SessionController();
