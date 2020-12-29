import { Request, Response} from 'express';
import logger from '../util/logger';
import { PageRequest } from '../models/PageRequest';
import { shallowParsePage, deepParsePage } from '../services/pageParser';

const _logParse = (req: Request, payload: string[]) => {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    logger.debug('Saving page view');

    const ip =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug(`Incoming ip: ${ip}`);

    const pageRequest = new PageRequest({
        sourceIp: ip,
        urlRequested: req.query.url,
        dateRequested: new Date(),
        result: 200,
        payload: payload
    });
    logger.debug('Saving view');
    pageRequest.save((err) => {
        if (err) {
            logger.error('Error saving page request', err);
        }
    });
};

export const deepParseUrl = (req: Request, res: Response) => {
    const url = req.query.url.toString();
    logger.debug(`Deep parsing url: ${url}`);
    (async () => {
        const result = await deepParsePage(url);
        const status = 'Success';
        res.send({
            title: status,
            data: result
        });
        _logParse(req, result.map((r: any) => r.url));
    })();
};
export const shallowParseUrl = (req: Request, res: Response) => {
    const url = req.query.url.toString();
    logger.debug(`Shallow parsing url: ${url}`);
    (async () => {
        const result = await shallowParsePage(url);
        const status = 'Success';
        res.send({
            title: status,
            data: result
        });
        _logParse(req, result.map((r: any) => r.url));
    })();
};
