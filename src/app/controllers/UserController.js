const Yup = require('yup');
const User = require('../models/User');

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    });

    await schema.validate(req.body, { abortEarly: false });

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const user = await User.create({ name, email, password });

    const { id, name: userName, email: userEmail } = user;
    return res.status(201).json({ id, name: userName, email: userEmail });
  }
}

module.exports = new UserController();
