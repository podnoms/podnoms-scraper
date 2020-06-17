import { Request, Response } from 'express';
import { PageRequest, PageRequestDocument } from '../models/PageRequest';
import logger from '../util/logger';
/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    var recentRequests = PageRequest.find()
        .sort({ dateRequested: -1, })
        .limit(250)
        .exec((err, results) => {
            if (!err) {
                res.render('requests', {
                    title: 'Requests',
                    model: results,
                });
            } else {
                logger.error('Error getting recent results', err);
            }
        });
};
