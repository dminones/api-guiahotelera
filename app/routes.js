import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import PostsController from './controllers/posts.controller';
import ItemsController from './controllers/items.controller';
import DestinationsController from './controllers/destinations.controller';
import BannersController from './controllers/banners.controller';
import BookingController from './controllers/booking.controller';
import SitesController from './controllers/sites.controller';

import authenticate from './middleware/authenticate';
import accessControl from './middleware/access-control';
import errorHandler from './middleware/error-handler';

const routes = new Router();

routes.get('/', MetaController.index);

// Authentication
/**
 * @api {get} /auth/login Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
routes.post('/auth/login', AuthController.login);

// Users
routes.get('/users', UsersController.search);
routes.post('/users', UsersController.create);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:username', UsersController._populate, UsersController.fetch);

// Post
routes.get('/post', PostsController.search);
// routes.post('/post', authenticate, PostsController.create);
routes.get('/post/:slug', PostsController._populate, PostsController.fetch);
// routes.delete('/post/:id', authenticate, PostsController.delete);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);

// Item
routes.get('/item', ItemsController.search);
// routes.get('/item/updateSlugs', ItemsController.updateSlugs);
routes.get('/item/:slug', ItemsController._populate, ItemsController.fetch);


// Categories
routes.get('/category', ItemsController.getCategories)

// Destinations home
routes.get('/:site/destination/home',  DestinationsController.home);

// Destinations
routes.get('/destination', DestinationsController.search)

routes.get('/random-destination-image',DestinationsController.getDestinationRandomImage)

// Categories
routes.get('/banner', BannersController.search)

// Accommodation Types
routes.get('/item-accommodationtype/', ItemsController.getAccomodationTypes)

// Booking
routes.post('/:site/book/', BookingController.book)

// Sites
routes.get('/sites/:slug', SitesController.fetch)

routes.use(errorHandler);

export default routes;
