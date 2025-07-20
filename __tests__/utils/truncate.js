const database = require('../../src/database');

module.exports = function truncate() {
  const { models } = database.connection;

  return Promise.all(
    Object.keys(models).map((key) =>
      models[key].destroy({
        where: {},
        force: true,
        truncate: true,
      })
    )
  );
};
