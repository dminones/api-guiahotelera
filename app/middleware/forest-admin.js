import ForestAdmin from 'forest-express-mongoose';

export default function forestAdmin(database) {
  return ForestAdmin.init({
    modelsDir: __dirname + '/../models', // Your models directory.
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    mongoose: database // The mongoose database connection.
  });
}