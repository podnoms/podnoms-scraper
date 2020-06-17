import { checkUrlAgainstLocalUrls } from './localPageChecker';
import e, { response } from 'express';
import RemotePageParser from './remotePageParser';
import { url } from 'inspector';

export function checkUrl(url: string): Promise<any> {
    return new Promise(resolve => {
        // first off, use our valid url list
        const parser = new RemotePageParser(url);
        parser.initialise().then((r: boolean) => {
            if (r) {
                const pageTitle = parser.getPageTitle();
                console.log('urlChecker', 'Checking local URL');
                var result = checkUrlAgainstLocalUrls(url);
                console.log('urlChecker', 'Checked local URL', false);
                if (result) {
                    resolve({
                        title: pageTitle,
                        type: 'local',
                        links: [
                            {
                                key: url.substring(url.lastIndexOf('/') + 1),
                                title: pageTitle,
                                url: url
                            }
                        ]
                    });
                } else {
                    parser.parsePage().then(r =>
                        resolve({
                            title: pageTitle,
                            type: 'remote',
                            links: r.map(url => {
                                return {
                                    key: url.substring(
                                        url.lastIndexOf('/') + 1
                                    ),
                                    title: pageTitle,
                                    url: url
                                };
                            })
                        })
                    );
                }
            } else {
                console.log('urlChecker', 'Error initialising parser');
                resolve({});
            }
        });
        // secondly, try to parse the raw page
    });
}
