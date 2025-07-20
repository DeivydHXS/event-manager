const Category = require('../models/Category');
const AppError = require('../errors/AppError');

class CategoryService {
  async getAll() {
    return Category.findAll({ order: [['name', 'ASC']] });
  }

  async create({ name }) {
    const categoryExists = await Category.findOne({ where: { name } });
    if (categoryExists) {
      throw new AppError('Category already exists.');
    }
    return Category.create({ name });
  }

  async update(id, { name }) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError('Category not found.', 404);
    }
    await category.update({ name });
    return category;
  }

  async delete(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError('Category not found.', 404);
    }
    await category.destroy();
  }
}

module.exports = new CategoryService();
