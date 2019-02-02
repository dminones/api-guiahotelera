import ForestAdmin from 'forest-express-mongoose';
import Destination from '../models/destination';
import Item from '../models/item';
import Banner from '../models/banner';

const updateBannerUrls = async (req, res, next) => {
  const items = await Banner.find({ src: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ });
  // const result = await Destination.find({}, {$unset: { slug: '' }});
  const data = [];
  for (let j = 0; j < items.length; j++) {
    const item = items[j];
    const src = item.src.replace('http://www.guiahoteleraargentina.com/', 'https://www.guiahoteleraargentina.com/');
    const result = await Banner.update({ _id: item._id }, { $set: { src } });
    data.push(result);
  }
  res.send({ data });
};

const updateDestinationsUrls = async (req, res, next) => {
  const items = await Destination.find({ image: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ });
  // const result = await Destination.find({}, {$unset: { slug: '' }});
  const data = [];
  for (let j = 0; j < items.length; j++) {
    const item = items[j];
    const image = item.image.replace('http://www.guiahoteleraargentina.com/', 'https://www.guiahoteleraargentina.com/');
    const result = await Destination.update({ _id: item._id }, { $set: { image } });
    data.push(result);
  }
  res.send({ data });
};

const updateItemsUrls = async (req, res, next) => {
  const items = [
    ...(await Item.find({ thumbnail: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ })),
    ...(await Item.find({ logoImage: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ })),
    ...(await Item.find({ gallery: { $elemMatch: { src: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ } } })),
  ];
  const data = [];
  for (let j = 0; j < items.length; j++) {
    const item = items[j];

    const thumbnail = item.thumbnail
      ? item.thumbnail.replace('http://www.guiahoteleraargentina.com/', 'https://www.guiahoteleraargentina.com/')
      : item.thumbnail;
    const logoImage = item.logoImage
      ? item.logoImage.replace('http://www.guiahoteleraargentina.com/', 'https://www.guiahoteleraargentina.com/')
      : item.logoImage;

    let { gallery } = item;
    if (gallery) {
      gallery = gallery
          .map((p) => p.toJSON())
          .map((galleryItem) => {
            return {
              ...galleryItem,
              src: galleryItem.src.replace(
                  'http://www.guiahoteleraargentina.com/',
                  'https://www.guiahoteleraargentina.com/'
              ),
            };
          });
    }
    const result = await Item.update({ _id: item._id }, { $set: { logoImage, thumbnail, gallery } });
    data.push(result);
  }
  res.send({ data });
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

  ForestAdmin.collection('Destination', {
    actions: [{ name: 'Update urls', global: true }],
  });

  app.post('/forest/actions/update-urls', ForestAdmin.ensureAuthenticated, updateDestinationsUrls);

  ForestAdmin.collection('Item', {
    actions: [{ name: 'Update Items urls', global: true }],
  });

  app.post('/forest/actions/update-items-urls', ForestAdmin.ensureAuthenticated, updateItemsUrls);

  ForestAdmin.collection('Banner', {
    actions: [{ name: 'Update Banners urls', global: true }],
  });

  app.post('/forest/actions/update-banners-urls', ForestAdmin.ensureAuthenticated, updateBannerUrls);


  app.use(forestAdmin);
}
