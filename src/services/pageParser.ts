import logger from '../util/logger';

const cheerio = require('cheerio');
const axios = require('axios').default;

const _getLinkTagLinks = ($: any): any => {
    return $('a').filter((index: number, link: any) => {
        const l = $(link);
        return (
            l.attr &&
            l.attr('href') &&
            (
                l.attr('href').split('?')[0].endsWith('mp3') ||
                l.attr('href').split('?')[0].endsWith('ogg') ||
                l.attr('href').split('?')[0].endsWith('wav') ||
                l.attr('href').split('?')[0].endsWith('m4a')
            )
        );
    });
};

const _getEmbeddedAudioTags = ($: any): any => {
    return $('audio').filter((index: number, link: any) => {
        const l = $(link);
        return (
            l.attr &&
            l.attr('src') &&
            l.attr('type') &&
            (l.attr('type').equals('audio/mp3') ||
                l.attr('type').equals('audio/mpeg') ||
                l.attr('type').equals('audio/ogg') ||
                l.attr('type').equals('audio/m4a') ||
                l.attr('type').equals('audio/wav'))
        );
    });
};

const _getSingleLevelAudioTags = ($: any): any => {
    return $('audio').filter((index: number, link: any) => {
        const l = $(link);
        return l.attr && l.attr('src');
    });
};

const _findLinksInHtml = (url: string, html: string) => {
    const $ = cheerio.load(html);

    let candidateLinks: string[] = [];
    const tags = _getLinkTagLinks($);
    const embedded = _getEmbeddedAudioTags($);
    const single = _getSingleLevelAudioTags($);

    tags.each((i: any, t: any) => {
        candidateLinks.push(new URL($(t).attr('href'), url).href);
    });
    embedded.each((i: any, t: any) => {
        candidateLinks.push(new URL($(t).attr('src'), url).href);
    });
    single.each((i: any, t: any) => {
        candidateLinks.push(new URL($(t).attr('src'), url).href);
    });

    candidateLinks = candidateLinks.filter(
        (item, index) => candidateLinks.indexOf(item) === index
    );
    const result = candidateLinks.map((url, index) => (
        {
            [url]: url.substring(url.lastIndexOf('/') + 1)
        }
    ));
    //dedupe & convert array to object
    return Object.assign({}, ...new Set(result));
};

const _renderPageFromUrl = async (url: string) => {
    try {
        const browserExe = process.env.CHROMIUM_BINARY || '/usr/bin/google-chrome-beta';
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({
            executablePath: browserExe,
            args: ['--no-sandbox'],
            headless: true
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        await page.goto(url, { waitUntil: 'networkidle0' });

        const result = await page.content();
        await browser.close();
        return result;
    } catch (err) {
        logger.error(`Error rendering page: ${err}`);
        return '';
    }
};

export const parseMetaTags = async (url: string) => {
    logger.debug(`Getting page meta tags ${url}`);
    let response = await axios.get(url);
    if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const meta = $('meta');
        const values = meta
            .filter(
                (i: number, element: any) =>
                    element &&
                    element.attribs &&
                    element.attribs.content &&
                    (element.attribs.name || element.attribs.property)
            )
            .map((i: number, element: any) => (
                {
                    [element.attribs.name || element.attribs.property]: element.attribs.content
                }
            ));

        return Object.assign({}, ...new Set(values));
    }
};

export const parsePageTitle = async (url: string) => {
    logger.debug(`Getting page title ${url}`);
    try {
        let response = await axios.get(url);

        logger.debug(`We have a response ${url}`);
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            return $('title').text();
        }
    } catch (err) {
        throw(err);
    }
};
export const deepParsePage = async (url: string) => {
    logger.debug(`Rendering page ${url}`);
    const html = await _renderPageFromUrl(url);
    if (!html) {
        return [];
    }
    return _findLinksInHtml(url, html);
};

export const shallowParsePage = async (url: string) => {
    let response = await axios.get(url);
    if (response.status !== 200) {
        return [];
    }
    return _findLinksInHtml(url, response.data);
};
