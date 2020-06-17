import { Request, Response, NextFunction } from 'express';
import { check, sanitize, validationResult } from 'express-validator';
import { checkUrl } from '../services/urlChecker';
import logger from '../util/logger';

export const parseUrl = (req: Request, res: Response) => {
    // await check('url', 'URL is not valid').isEmail().run(req);
    // await sanitize('url').run(req);

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     logger.error('Error parsing API request', errors.array());
    //     res.render('check-url', {
    //         title: 'Error',
    //         data: errors.array(),
    //     });
    // }
    logger.debug(`Parsing url: ${req.body.url}`);
    checkUrl(req.body.url).then((result: string[]) => {
        res.send({
            title: 'Success',
            data: result,
        });
    });
};
