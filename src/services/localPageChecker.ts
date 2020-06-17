import { validUrlList } from '../data';

function matchInArray(string: string, expressions: string[]) {
    var len = expressions.length,
        i = 0;

    for (; i < len; i++) {
        try {
            const checker = RegExp(expressions[i]);
            if (string.match(expressions[i])) {
                return true;
            }
        } catch (e) {
            console.error('Error applying regex', expressions[i], e);
        }
    }
    return false;
}

export const checkUrlAgainstLocalUrls = (url: string): boolean => {
    const bare = new URL(url).host;
    return matchInArray(bare, validUrlList);
};
