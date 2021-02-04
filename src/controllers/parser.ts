import { NextFunction, Request, Response } from 'express';
import logger from '../util/logger';
import { PageRequest } from '../models/PageRequest';
import { shallowParsePage, deepParsePage, parsePageTitle, parseMetaTags } from '../services/pageParser';

const _logParse = (req: Request, payload: string[]) => {
    if (process.env.NODE_ENV === 'test') {
        return;
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    logger.debug(`Incoming ip: ${ip}`);
    logger.debug(`Payload: ${payload}`);

    const pageRequest = new PageRequest({
        sourceIp: ip,
        urlRequested: req.query.url,
        dateRequested: new Date(),
        result: 200,
        payload: payload
    });

    pageRequest.save((err) => {
        if (err) {
            logger.error('Error saving page request', err);
        }
    });
};

export const getHeadMetaTags = (req: Request, res: Response) => {
    const url = req.query.url.toString();
    logger.debug(`Deep parsing url: ${url}`);
    (async () => {
        const result = await parseMetaTags(url);
        const status = 'Success';
        res.send({
            result: status,
            data: result
        });
        _logParse(req, result);
    })();
};

export const getPageTitle = (req: Request, res: Response, next: NextFunction) => {
    const url = req.query.url.toString();
    logger.debug(`Deep parsing url: ${url}`);
    (async () => {
        try {
            const result = await parsePageTitle(url);
            const status = 'Success';
            res.send({
                result: status,
                data: {
                    title: result
                }
            });
            _logParse(req, result);
        } catch (err) {
            next(err);
        }
    })();
};

export const deepParseUrl = (req: Request, res: Response) => {
    const url = req.query.url.toString();
    logger.debug(`Deep parsing url: ${url}`);
    (async () => {
        const result = await deepParsePage(url);
        const status = 'Success';
        res.send({
            result: status,
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
            result: status,
            data: result
        });
        _logParse(req, result.map((r: any) => r.url));
    })();
};
