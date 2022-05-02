import ForestAdmin from 'forest-express-mongoose';
import Destination from '../models/destination';
import Item from '../models/item';
import Banner from '../models/banner';

const sites = {
  argentina: {
    replaces: [
      {
        // regex: RegExp(/.*https:\/\/guiahoteleraargentina\.com\/imagenes.*/),
        old: 'http://guiahoteleraargentina.com/imagenes/',
        new: 'https://imagenes.guiahoteleraargentina.com/',
      },
      {
        // regex: RegExp(/.*https:\/\/www\.guiahoteleraargentina\.com\/imagenes.*/),
        old: 'http://www.guiahoteleraargentina.com/imagenes/',
        new: 'https://imagenes.guiahoteleraargentina.com/',
      },
      {
        // regex: RegExp(/.*https:\/\/guiahoteleraargentina\.com\/imagenes.*/),
        old: 'https://guiahoteleraargentina.com/imagenes/',
        new: 'https://imagenes.guiahoteleraargentina.com/',
      },
      {
        // regex: RegExp(/.*https:\/\/www\.guiahoteleraargentina\.com\/imagenes.*/),
        old: 'https://www.guiahoteleraargentina.com/imagenes/',
        new: 'https://imagenes.guiahoteleraargentina.com/',
      },
    ],
    models: {
      banner: {
        model: Banner,
        properties: [{ propertyName: 'src' }],
      },
      destination: {
        model: Destination,
        properties: [{ propertyName: 'image' }],
      },
      item: {
        model: Item,
        properties: [
          { propertyName: 'thumbnail' },
          { propertyName: 'logoImage' },
          { propertyName: 'gallery', array: true },
        ],
      },
    },
  },
  bolivia: {
    replaces: [
      {
        regex: RegExp(/.*http:\/\/guiahotelerabolivia\.com\/imagenes.*/),
        old: 'http://guiahotelerabolivia.com/imagenes/',
        new: 'https://imagenes.guiahotelerabolivia.com/',
      },
      {
        regex: RegExp(/.*http:\/\/(www\.)?guiahotelerabolivia\.com\/imagenes.*/),
        old: 'http://www.guiahotelerabolivia.com/imagenes/',
        new: 'https://imagenes.guiahotelerabolivia.com/',
      },
      {
        regex: RegExp(/.*https:\/\/guiahotelerabolivia\.com\/imagenes.*/),
        old: 'https://guiahotelerabolivia.com/imagenes/',
        new: 'https://imagenes.guiahotelerabolivia.com/',
      },
      {
        regex: RegExp('/.*https://www.guiahotelerabolivia.com\/imagenes.*/'),
        old: 'https://www.guiahotelerabolivia.com/imagenes/',
        new: 'https://imagenes.guiahotelerabolivia.com/',
      },
    ],
    models: {
      banner: {
        model: Banner,
        properties: [{ propertyName: 'src' }],
      },
      destination: {
        model: Destination,
        properties: [{ propertyName: 'image' }],
      },
      item: {
        model: Item,
        properties: [
          { propertyName: 'thumbnail' },
          { propertyName: 'logoImage' },
          { propertyName: 'gallery', array: true },
        ],
      },
    },
  },
};

const getPairsArray = (arr1, arr2) => {
  const pairs = [];

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      pairs.push([arr1[i], arr2[j]]);
    }
  }

  return pairs;
};

const getUpdatedValue = (value, replace) => {
  if (value && (typeof value === 'string' || value instanceof String)) {
    return value.replace(replace.old, replace.new);
  }
  if (value && value.length > 0 ) {
    return value
        .map((p) => p.toJSON())
        .map((item) => {
          return {
            ...item,
            src: item.src.replace(replace.old, replace.new),
          };
        });
  }
  return value;
};

const updateUrls = async (model, properties, replaces) => {
  const pairs = getPairsArray(properties, replaces);
  // const items = await Promise.all(pairs.map(([property, replace]) => model.find({ [property.propertyName]: replace.regex }))).then(
  //     (result) => [].concat.apply([], ...result)
  // );
  const items = await model.find();

  let data = [];
  for (let j = 0; j < items.length; j++) {
    const newData = await Promise.all(
        pairs.map(([property, replace]) => {
          const { propertyName } = property;
          const item = items[j];
          const toReplace = item[propertyName];
          const data = getUpdatedValue(toReplace, replace);
          if (propertyName == "gallery")
            console.log({ toReplace, old: replace.old, new: replace.new, data });
          if (data && toReplace !== data) {
            return model.update({ _id: item._id }, { $set: { [propertyName]: data } });
          }
          return Promise.resolve(null);
        })
    ).then((result) => [].concat.apply([], ...result));
    data = [...data, ...newData];
  }
  console.log({ data });

  return data;
};

const updateModel = async (modelName) => {
  return Promise.all(
      Object.keys(sites).map(async (siteName) => {
        const site = sites[siteName];
        const { model, properties } = site.models[modelName];
        return { siteName, data: await updateUrls(model, properties, site.replaces) };
      })
  );
};

const updateBannerUrls = async (req, res, next) => {
  try {
    const result = await updateModel('banner');
    res.send({ result });
  } catch (e) {
    res.send({ e });
  }
};

const updateDestinationsUrls = async (req, res, next) => {
  const result = await updateModel('destination');
  res.send({ result });
};

const updateItemsUrls = async (req, res, next) => {
  const result = await updateModel('item');
  res.send({ result });
  // const items = [
  //   ...(await Item.find({ thumbnail: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ })),
  //   ...(await Item.find({ logoImage: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ })),
  //   ...(await Item.find({ gallery: { $elemMatch: { src: /.*http:\/\/www\.guiahoteleraargentina\.com\.*/ } } })),
  // ];
  // const data = [];
  // for (let j = 0; j < items.length; j++) {
  //   const item = items[j];

  //   const thumbnail = item.thumbnail
  //     ? item.thumbnail.replace('http://www.guiahoteleraargentina.com/', 'https://www.guiahoteleraargentina.com/')
  //     : item.thumbnail;
  //   const logoImage = item.logoImage
  //     ? item.logoImage.replace('http://www.guiahoteleraargentina.com/', 'https://www.guiahoteleraargentina.com/')
  //     : item.logoImage;

  //   let { gallery } = item;
  //   if (gallery) {
  //     gallery = gallery
  //         .map((p) => p.toJSON())
  //         .map((galleryItem) => {
  //           return {
  //             ...galleryItem,
  //             src: galleryItem.src.replace(
  //                 'http://www.guiahoteleraargentina.com/',
  //                 'https://www.guiahoteleraargentina.com/'
  //             ),
  //           };
  //         });
  //   }
  //   const result = await Item.update({ _id: item._id }, { $set: { logoImage, thumbnail, gallery } });
  //   data.push(result);
  // }
  // res.send({ data });
};

export default function forestAdmin(app, database) {
  // Setup the Forest Liana middleware in your app.js file
  // app.put('/forest/Item/:itemId', ForestAdmin.ensureAuthenticated, addSlug);
  // app.post('/forest/Item', ForestAdmin.ensureAuthenticated, addSlug);

  ForestAdmin.init({
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping: database,
    connections: { default: database.connection },
  }).then((FAMiddleware) => {
    app.use(FAMiddleware);
  });

  ForestAdmin.collection('Destination', {
    actions: [{ name: 'Update urls', type: 'global' }],
  });

  app.post('/forest/actions/update-urls', ForestAdmin.ensureAuthenticated, updateDestinationsUrls);

  ForestAdmin.collection('Item', {
    actions: [{ name: 'Update Items urls', type: 'global' }],
  });

  app.post('/forest/actions/update-items-urls', ForestAdmin.ensureAuthenticated, updateItemsUrls);

  ForestAdmin.collection('Banner', {
    actions: [{ name: 'Update Banners urls', type: 'global' }],
  });

  app.post('/forest/actions/update-banners-urls', ForestAdmin.ensureAuthenticated, updateBannerUrls);
}
