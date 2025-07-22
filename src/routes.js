const { Router } = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('./app/middlewares/auth');
const { canManageEvent } = require('./app/middlewares/authorization');
const isAdmin = require('./app/middlewares/isAdmin');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const EventController = require('./app/controllers/EventController');
const AttendanceController = require('./app/controllers/AttendanceController');
const ProfileController = require('./app/controllers/ProfileController');
const CategoryController = require('./app/controllers/CategoryController');

const uploadConfig = require('./config/upload');

const routes = new Router();
const upload = multer(uploadConfig);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message:
    'Too many login or registration attempts from this IP, please try again after 15 minutes',
});

routes.get('/', (req, res) =>
  // #swagger.tags = ['Healthcheck']
  // #swagger.summary = 'Verifica se a API está no ar.'
  res.json({ message: 'Welcome to Event Manager API!' })
);

routes.post('/users', authLimiter, UserController.store);
// #swagger.tags = ['Users'] #swagger.summary = 'Registra um novo usuário.'
routes.post('/sessions', authLimiter, SessionController.store);
// #swagger.tags = ['Users'] #swagger.summary = 'Autentica um usuário e retorna um token JWT.'

routes.get('/events', EventController.index);
/* #swagger.tags = ['Events']
    #swagger.summary = 'Lista todos os eventos com filtros, paginação e ordenação.'
    #swagger.parameters['page'] = { in: 'query', description: 'Número da página.', type: 'integer' }
    #swagger.parameters['limit'] = { in: 'query', description: 'Número de itens por página.', type: 'integer' }
    #swagger.parameters['location'] = { in: 'query', description: 'Filtra eventos por localização (case-insensitive).', type: 'string' }
    #swagger.parameters['time'] = { in: 'query', description: 'Filtra por tempo: future (padrão), past, ou all.', type: 'string' }
    #swagger.parameters['sortBy'] = { in: 'query', description: 'Campo para ordenação (ex: date, name).', type: 'string' }
    #swagger.parameters['order'] = { in: 'query', description: 'Ordem da ordenação: ASC ou DESC.', type: 'string' }
*/
routes.get('/events/:id', EventController.show);
// #swagger.tags = ['Events'] #swagger.summary = 'Busca um evento específico pelo ID.'

routes.get('/categories', CategoryController.index);

routes.use(authMiddleware);

routes.post('/events', EventController.store);
// #swagger.tags = ['Events'] #swagger.summary = 'Cria um novo evento.'
routes.put('/events/:id', canManageEvent, EventController.update);
// #swagger.tags = ['Events'] #swagger.summary = 'Edita um evento.'
routes.delete('/events/:id', canManageEvent, EventController.delete);
// #swagger.tags = ['Events'] #swagger.summary = 'Deleta um evento.'

routes.patch(
  '/events/:id/image',
  upload.single('image'),
  EventController.updateImage
);

routes.post('/events/:id/attend', AttendanceController.store);
// #swagger.tags = ['Events'] #swagger.summary = 'Adiciona participação a um evento.'
routes.delete('/events/:id/unattend', AttendanceController.delete);
// #swagger.tags = ['Events'] #swagger.summary = 'Deleta participação de um evento.'

routes.get('/profile', ProfileController.show);
routes.put('/profile', ProfileController.update);

routes.post('/categories', isAdmin, CategoryController.store);
routes.put('/categories/:id', isAdmin, CategoryController.update);
routes.delete('/categories/:id', isAdmin, CategoryController.delete);

module.exports = routes;
