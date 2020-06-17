import { Request, Response, NextFunction } from 'express';
import { check, sanitize, validationResult } from 'express-validator';
import { checkUrl } from 'src/services/urlChecker';
export const parseUrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    await check('url', 'URL is not valid').isEmail().run(req);
    await sanitize('url').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/login');
    }
    checkUrl(req.body.url).then((result: string[]) => {
        res.render('check-url', {
            title: 'Success',
            profile: result,
        });
    });
};
