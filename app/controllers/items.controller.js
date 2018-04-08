import BaseController from './base.controller';
import Item from '../models/item';
import AccommodationType from '../models/accommodation_type';
import Destination from '../models/destination';

let orderByAccomodationType = function(a, b) {
    const aOrder = a._accommodationType ? a._accommodationType.order : Number.MAX_SAFE_INTEGER;
    const bOrder = b._accommodationType ? b._accommodationType.order : Number.MAX_SAFE_INTEGER;

    if (aOrder < bOrder) {
        return -1;
    }
    if (bOrder < aOrder) {
        return 1;
    }
    // a must be equal to b
    return 0;
};

let orderByPublicationType = function(a, b) {
    let publicationTypes = {
        "Figuracion": 1,
        "Basica": 2,
        "PremiumDestino": 3,
        "Premium": 4,
    };

    const aPublicationOrder = publicationTypes[a.publicationType] ? publicationTypes[a.publicationType] : 0;
    const bPublicationOrder = publicationTypes[b.publicationType] ? publicationTypes[b.publicationType] : 0;

    if (aPublicationOrder > bPublicationOrder) {
        return -1;
    }
    if (aPublicationOrder < bPublicationOrder) {
        return 1;
    }
    // a must be equal to b
    return 0;
};

let orderByName = function(a, b) {
    if (a.name < b.name)
        return -1
    if (a.name > b.name)
        return 1
    return 0
};

let orderByAll = function(a, b) {
    let orders = [
        orderByPublicationType,
        orderByAccomodationType,
        orderByName
    ]

    var i = 0
    while (i < orders.length && orders[i](a, b) == 0) {
        i++
    }
    let index = (i < orders.length) ? i : orders.length - 1
    return orders[index](a, b)
}

class ItemController extends BaseController {

    getDestinationsIds = async (site, destination, nested) => {
        var params = {};
        if( site )
            params.site = site;
        if(destination)
            params._id = destination;
        
        var destinations = await Destination.find(params);
        if(nested) {
            var stack = destinations.slice();
            while (stack.length>0){
                stack = await Destination.find({_parent:{ $in: stack.map(i=>i._id) }});
                destinations = [...destinations, ...stack];
            }
        }
        
        return destinations.map(i => i._id);
    }

    search = async(req, res, next) => {

        try {
            var query = req.query;
            if (query.name)
                query.name = new RegExp(query.name, "i");

            const site = query.site;
            if (site || query._destination) {
                const destinationIds = await this.getDestinationsIds(site, query._destination, true);
                console.log("Destinations .> ", destinationIds);
                query._destination = { $in: destinationIds };
                delete query.site;
            }
            if(query.publicationType) {
                query.publicationType = { $in: query.publicationType.split(',') }
            }
                
            const items = await Item.find(query)
                .populate(['_destination', '_accommodationType']);
            res.json(items.sort(orderByAll))
        } catch (err) {
            next(err);
        }
    }

    getCategories = async(req, res, next) => {
        try {
            const categories = await Item.find(req.query).distinct('category')
            res.json(categories)
        } catch (err) {
            next(err);
        }
    }

    getAccomodationTypes = async(req, res, next) => {
    	try {
    		const accommodationTypesIds = await Item.find(req.query)
    												.populate('_accommodationType')
    												.distinct('_accommodationType');
    		const accommodationTypes = await AccommodationType.find({_id:accommodationTypesIds});
    		res.json(accommodationTypes);
    	} catch (err) {
    		next(err);
    	}
    }
}

export default new ItemController();


