import normalizeUrl from 'normalize-url';
import crypto from 'crypto';

export const normalizerOpts = {
    forceHttps: true,
    stripAuthentication: true,
    stripHash: true,
    stripTextFragment: true
}


export function hash(input: string, algo = "sha256"): string {
    return crypto.createHash(algo).update(input).digest("hex");
}

export function urlAsID(url: string){
    return hash(normalizeUrl(url, normalizerOpts));
}