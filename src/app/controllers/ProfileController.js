const Yup = require('yup');
const ProfileService = require('../services/ProfileService');

class ProfileController {
  async show(req, res) {
    const user = await ProfileService.get(req.userId);
    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
    });

    await schema.validate(req.body, { abortEarly: false });

    const updatedUser = await ProfileService.update(req.userId, req.body);

    return res.json(updatedUser);
  }
}

module.exports = new ProfileController();
