import { SearchOptions, SearchParams } from "typesense/lib/Typesense/Documents.js";
interface Test{
    unused: string;
}

export interface Item {
    title: string;
    desc: string;
    uri: string;
    page_title?: string;
    page_desc?: string;
    page_keywords?: string[];
    points: number;
    // Example: document,audio,video,image
    item_type: string;
    host?: string;
    // Example: youtube_music,spotify,pintrest,twitter,yelp
    platform?: string;
    flags?: string[];
    id?: string; // allows upserting. Usually a hash of normalized url
    time_indexed?: number;
}

export interface SearchParamsExtended extends SearchParams {
    collectionName?: string;
}