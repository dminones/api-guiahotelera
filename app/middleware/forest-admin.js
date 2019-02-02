import ForestAdmin from 'forest-express-mongoose';
import Destination from '../models/destination';

const addSlug = (req, res, next) => {
  // Your business logic here. 
  next();
};

const updateUrls = async (req, res, next) => {
  const items = await Destination.find({ image: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ });
  //const result = await Destination.find({}, {$unset: { slug: '' }});
  const data = []
  for(let j = 0; j < items.length; j++){
    const item = items[j]
    const image = item.image.replace('http://www.guiahoteleraargentina.com/','https://www.guiahoteleraargentina.com/')
    const result = await Destination.update({_id:item._id}, {$set: { image }});
    data.push(result)
  }
  res.send( { data } );
}

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

  ForestAdmin.collection('Destination', {
    actions: [{ name: 'Update urls', global: true }],
  });

  app.post('/forest/actions/update-urls', ForestAdmin.ensureAuthenticated, updateUrls);

  app.use(forestAdmin);
}
