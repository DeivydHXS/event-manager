require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Yup = require('yup');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

const AppError = require('./app/errors/AppError');
const uploadConfig = require('./config/upload');

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
    this.server.use('/files', express.static(uploadConfig.directory));
    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message:
        'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.server.use(apiLimiter);
  }

  swagger() {
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  }

  routes() {
    this.swagger();
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use((err, req, res, next) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          error: err.message,
        });
      }

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
