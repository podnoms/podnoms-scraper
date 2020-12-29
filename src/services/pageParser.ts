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
    return candidateLinks;
};

const _renderPageFromUrl = async (url: string) => {
    try {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        await page.goto(url, { waitUntil: 'networkidle0' });

        const result = await page.content();
        await browser.close();
        return result;
    } catch {
        return '';
    }
};

export const deepParsePage = async (url: string) => {
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
