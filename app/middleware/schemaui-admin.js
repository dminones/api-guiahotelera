import auth from 'basic-auth';
import Destination from '../models/destination';
import DestinationsBlock from '../models/destinations_block';
import AccommodationType from '../models/accommodation_type';
import Banner from '../models/banner';
import Item from '../models/item';
import UserModel from '../models/user';
import Post from '../models/post';

export default function schemaUI(app, database) {
    const SchemaUI = require('schemaui');
    SchemaUI.init();

    SchemaUI.registerModel(Item, {
        listFields: [ '_id', 'name', 'slug', 'category', 'order'], 
        fields: { // define explicit options per field
            'overview': {
                textarea: true
            },
            'headDescription': {
              textarea: true
            },
        }
    });

    SchemaUI.registerModel(Destination,{
      listFields: ['_id','name', 'slug', 'site', 'order'], 
      fields: { // define explicit options per field
          'description': {
              textarea: true
          },
          'headDescription': {
            textarea: true
          },
      }
    });

    SchemaUI.registerModel(Post, {
      listFields: [ '_id', 'slug', 'title'], 
      fields: { // define explicit options per field
        'content': {
            textarea: true
        },
        'headDescription': {
          textarea: true
        },
      }
    });

    SchemaUI.registerModel(AccommodationType, {
      listFields: [ '_id', 'name', 'order'],
    });


    SchemaUI.registerModel(Banner, {
        listFields: [ '_id', 'name', 'site', 'link','order'], 
    });

    SchemaUI.registerModel(DestinationsBlock, {
        listFields: ['_id', 'site'], 
    });

    SchemaUI.registerModel(UserModel, {
        listFields: [ 'username', 'email'], 
        permissions: { // define permissions per model
            read: true, // readonly
            create: false,
            edit: false,
            delete: false
        }
    });

    // Admin
    app.use('/schemaui', function (request, response, next) {
        var requesstUser = auth(request) || { name: null }
        
        UserModel.findOne({username: requesstUser.name}, function(err, dbUser) {
            console.log('err', err)
            console.log('dbUser', dbUser)

            if (!dbUser || !dbUser.authenticate(requesstUser.pass)) {
                // amazonq-ignore-next-line
                response.set('WWW-Authenticate', 'Basic realm="example"')
                response.status(401).send()
                next()
              }
              return SchemaUI.middleware()(request, response, next)
        })
      });
}
