import BaseController from './base.controller';
import Destination from '../models/destination';
import DestinationsBlock from '../models/destinations_block';

class DestinationController extends BaseController {

    home = async(req, res, next) => {
        console.log("HOME -> ",req.params.site);
        const results = await DestinationsBlock.findOne({ site: req.params.site }).populate(['destinations']);
        console.log("RESULTS -> ",results);

        res.json((results && results.destinations) ? results.destinations : []);
    }

    search = async(req, res, next) => {
        var query = { ...req.query }
        const onlyOrdered = (query.onlyOrdered == '1')
        delete query.onlyOrdered
        
        if(query._parent) {
            query._parent = (query._parent==='0') ? null : query._parent;
        }
        
        console.log(query)
        var queries = []

        var queryOrdered = { ...query }
        queryOrdered.order = { $ne: null }
        queries.push(queryOrdered)

        if (!onlyOrdered) {
            var queryOrderNull = { ...query }
            queryOrderNull.order = null
            queries.push(queryOrderNull)
        }

        var promises = queries.map((query) => {
            return new Promise((resolve, reject) => {
                Destination.find(query).sort('order').exec((error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            })
        })

        try {
            const values = await Promise.all(promises);

            var results = values[0]
            if (values.length > 1) {
                results = values[0].concat(values[1])
            }

            res.json(results);
        } catch (err) {
            next(err);
        }
    }

    getDestinationRandomImage = async(req, res, next) => {
        try {
            var query = { image: { $ne: null } };
            if(req.query.site) {
                query.site = req.query.site
            }
            
            const count = await Destination.count(query);
            const random = Math.floor(Math.random() * count)
            const destination = await Destination.findOne(query).skip(random);
            
            res.writeHead(302, {
                'Location': destination.image
            });
            res.end();
        } catch (err) {
            next(err);
        }
    }
}

export default new DestinationController();
