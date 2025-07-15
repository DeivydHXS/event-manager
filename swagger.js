// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Event Manager API',
    description: 'API para gerenciamento de eventos, usuários e participações.',
    version: '1.0.0',
  },
  host: 'localhost:3333',
  schemes: ['http'],
  // Configuração para o botão 'Authorize' funcionar com nosso token JWT
  // securityDefinitions: {
  //   Bearer: {
  //     type: 'apiKey',
  //     name: 'Authorization',
  //     in: 'header',
  //     description:
  //       "Enter 'Bearer' followed by a space and then your JWT token.",
  //   },
  // },
  // security: [{ Bearer: [] }],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes.js']; // O arquivo que contém nossas definições de rotas

swaggerAutogen(outputFile, endpointsFiles, doc);
