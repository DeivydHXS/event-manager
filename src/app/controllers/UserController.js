const Yup = require('yup');
const UserService = require('../services/UserService');

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    await schema.validate(req.body, { abortEarly: false });

    const user = await UserService.create(req.body);

    return res.status(201).json(user);
  }
}

module.exports = new UserController();
