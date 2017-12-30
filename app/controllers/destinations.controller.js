import BaseController from './base.controller';
import Destination from '../models/destination';

class DestinationController extends BaseController {

    search = async(req, res, next) => {
        var query = { ...req.query }
        const onlyOrdered = (query.onlyOrdered == '1')
        delete query.onlyOrdered

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
            const random = Math.floor(Math.random() * count)
            const [count, destination] = await Promise.all([
                Destination.count({ image: { $ne: null } }),
                Destination.findOne({ image: { $ne: null } }).skip(random)
            ]);
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
