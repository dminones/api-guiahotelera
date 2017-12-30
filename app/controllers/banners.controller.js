import BaseController from './base.controller';
import Banner from '../models/banner';

class BannerController extends BaseController {

	search = async(req, res, next) => {
		try {
			var query = { ...req.query }
			if(query._destination) {
				query._destination = (req.query._destination === 'null') ? null : query._destination
			}
			const banners = await Banner.find(query).sort('order')
	      	res.json(banners);
	    } catch(err) {
	      next(err);
	    }
	}
}

export default new BannerController();