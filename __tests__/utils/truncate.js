const database = require('../../src/database');

module.exports = function truncate() {
  const { models } = database.connection;

  return Promise.all(
    Object.keys(models).map((key) =>
      // Usamos .destroy() com truncate: true para um reset rápido e eficiente da tabela.
      models[key].destroy({
        where: {},
        force: true,
        truncate: true,
      })
    )
  );
};
