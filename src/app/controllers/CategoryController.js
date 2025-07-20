const Yup = require('yup');
const CategoryService = require('../services/CategoryService');

class CategoryController {
  async index(req, res) {
    const categories = await CategoryService.getAll();
    return res.json(categories);
  }

  async store(req, res) {
    const schema = Yup.object().shape({ name: Yup.string().required() });
    await schema.validate(req.body, { abortEarly: false });
    const category = await CategoryService.create(req.body);
    return res.status(201).json(category);
  }

  async update(req, res) {
    const schema = Yup.object().shape({ name: Yup.string().required() });
    await schema.validate(req.body, { abortEarly: false });
    const category = await CategoryService.update(req.params.id, req.body);
    return res.json(category);
  }

  async delete(req, res) {
    await CategoryService.delete(req.params.id);
    return res.status(204).send();
  }
}

module.exports = new CategoryController();
