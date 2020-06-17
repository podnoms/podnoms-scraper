import { resolve } from 'url';
import logger from '../util/logger';

const rp = require('request-promise');
const cheerio = require('cheerio');

class RemotePageParser {
    $: any;
    constructor(private url: string) {}

    private _getLinkTagLinks($: any): any {
        const links = $('a').filter((index: number, link: any) => {
            const l = $(link);
            return (
                l.attr &&
                l.attr('href') &&
                (l
                    .attr('href')
                    .split('?')[0]
                    .endsWith('mp3') ||
                    l
                        .attr('href')
                        .split('?')[0]
                        .endsWith('ogg') ||
                    l
                        .attr('href')
                        .split('?')[0]
                        .endsWith('wav') ||
                    l
                        .attr('href')
                        .split('?')[0]
                        .endsWith('m4a'))
            );
        });
        return links;
    }
    private _getEmbeddedAudioTags($: any): any {
        const links = $('audio').filter((index: number, link: any) => {
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
        return links;
    }
    private _getSingleLevelAudioTags($: any): any {
        const links = $('audio').filter((index: number, link: any) => {
            const l = $(link);
            return l.attr && l.attr('src');
        });
        return links;
    }

    initialise(): Promise<boolean> {
        return new Promise((resolve) => {
            rp(this.url)
                .then((html: any) => {
                    this.$ = cheerio.load(html);
                    resolve(true);
                })
                .catch((error: any) => {
                    logger.error(error);
                    resolve(false);
                });
        });
    }

    getPageTitle(): string {
        return this.$('title').text();
    }

    parsePage(): Promise<string[]> {
        return new Promise((resolve) => {

            var candidateLinks: string[] = [];
            const tags = this._getLinkTagLinks(this.$);
            const embedded = this._getEmbeddedAudioTags(this.$);
            const single = this._getSingleLevelAudioTags(this.$);

            tags.each((i: any, t: any) => {
                candidateLinks.push(this.$(t).attr('href'));
            });
            embedded.each((i: any, t: any) => {
                candidateLinks.push(this.$(t).attr('src'));
            });
            single.each((i: any, t: any) => {
                candidateLinks.push(this.$(t).attr('src'));
            });

            candidateLinks = candidateLinks.filter(
                (item, index) => candidateLinks.indexOf(item) === index
            );
            resolve(candidateLinks);
        });
    }
}
export default RemotePageParser;
