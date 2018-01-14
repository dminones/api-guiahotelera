import BaseController from './base.controller';
import Site from '../models/site';

class SiteController extends BaseController {
	
	fetch = async(req, res, next) => {
	    const { slug } = req.params;
	    try {
	        const site = await Site.findOne({ slug });
	        if (!site) {
	            const err = new Error('Site not found.');
	        	err.status = 404;
	        	next(err)
	        }

	        req.site = site;
	        res.json(req.site);
	    } catch (err) {
	        next(err);
	    }
	}

	/**
   	* req.site is populated by middleware in routes.js
   	*/

}

export default new SiteController();