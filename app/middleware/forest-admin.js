import ForestAdmin from 'forest-express-mongoose';

const addSlug = (req, res, next) => {
  // Your business logic here. 
  next();
};

export default function forestAdmin(app, database) {
  // Setup the Forest Liana middleware in your app.js file
  // app.put('/forest/Item/:itemId', ForestAdmin.ensureAuthenticated, addSlug);
  // app.post('/forest/Item', ForestAdmin.ensureAuthenticated, addSlug);

  const forestAdmin = ForestAdmin.init({
    modelsDir: __dirname + '/../models', // Your models directory.
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    mongoose: database, // The mongoose database connection.
  });

  app.use(forestAdmin);
}
