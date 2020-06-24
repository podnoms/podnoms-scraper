import { Request, Response, NextFunction } from 'express';
import { checkUrl } from '../services/urlChecker';
import logger from '../util/logger';
import { PageRequest } from '../models/PageRequest';

export const parseUrl = (req: Request, res: Response) => {
    logger.debug(`Parsing url: ${req.body.url}`);
    checkUrl(req.body.url).then((result: any) => {
        const status = 'Success'; // TODO
        res.send({
            title: status,
            data: result,
        });
        logger.debug('Saving page view');

        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        logger.debug(`Incoming ip: ${ip}`);

        const pageRequest = new PageRequest({
            sourceIp: ip,
            urlRequested: req.body.url,
            dateRequested: new Date(),
            result: status,
            payload: result.links.map((r: any) => r.url),
        });
        logger.debug('Saving view');
        pageRequest.save((err) => {
            if (err) {
                logger.error('Error saving page request', err);
            }
        });
    });
};
