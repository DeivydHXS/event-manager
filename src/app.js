require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Yup = require('yup');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

const routes = require('./routes');
require('./database');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.swagger();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(helmet());

    const corsOptions = {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    };

    this.server.use(cors(corsOptions));
    this.server.use(express.json());
    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Limita cada IP a 100 requisições por janela de 15 minutos
      message:
        'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true, // Retorna informações do limite nos cabeçalhos `RateLimit-*`
      legacyHeaders: false, // Desativa os cabeçalhos antigos `X-RateLimit-*`
    });
    this.server.use(apiLimiter);
  }

  routes() {
    this.server.use(routes);
  }

  swagger() {
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  }

  exceptionHandler() {
    this.server.use((err, req, res, next) => {
      if (err instanceof Yup.ValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          messages: err.inner.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        });
      }

      console.error(err);

      return res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      });
    });
  }
}

module.exports = new App().server;
