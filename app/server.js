import express from 'express';
import cors from './middleware/cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import helmet from 'helmet';

import routes from './routes';
import Constants from './config/constants';

// Initialize Database
import database from './database';
import forestAdmin from './middleware/forest-admin';

const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// Enable CORS with various options
// https://github.com/expressjs/cors
// Cambiado por la configuración de cors custom del middleware
app.use(cors());

// Setup the Forest Liana middleware in your app.js file
app.use(forestAdmin(database));

// Request logger
// https://github.com/expressjs/morgan
if (!Constants.envs.test) {
  app.use(morgan('dev'));
}

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride());

// Mount public routes
app.use('/public', express.static(`${__dirname}/public`));

// Mount API routes
app.use(Constants.apiPrefix, routes);

app.listen(Constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${Constants.port}
    Env: ${app.get('env')}
  `);
});

export default app;
