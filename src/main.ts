import Typesense from "typesense";
import {defaultSchema} from "./schemas.js";

import {Item,SearchParamsExtended} from "./interfaces.js";

import url from 'url'

import {urlAsID,normalizerOpts} from "./utils.js";
import normalizeUrl from 'normalize-url';

class Searcher {
    // TODO: MAKE TYPES!  
    opts: any;
    client: Typesense.Client;
    collectionNames: string[];
    defaultCollection: string;
    constructor(opts: any = {}){
        this.opts = opts;
        this.collectionNames = opts.collectionNames || ["default"];
        this.defaultCollection = opts.defaultCollection || this.collectionNames[0];

        const API_KEY = process.env.TYPESENSE_API_KEY || this.opts.apiKey;
        // console.log("API KEY", API_KEY, process.env.TYPESENSE_API_KEY);
        
        this.client = new Typesense.Client({
            apiKey: API_KEY,
            nodes: [{
              'host': process.env.TYPESENSE_HOST || 'localhost',
              'port':  parseInt(process.env.TYPESENSE_PORT) || 8108,
              'protocol': process.env.TYPESENSE_PROTOCOL || 'http'
            }] || opts.nodes,
            'connectionTimeoutSeconds': 10
        });
    }

    async init(){
        await Promise.all(this.collectionNames.map(async (collectionName) => {
            let collectionOpts = {
                ...defaultSchema,
                name: collectionName
            };
            if(this.opts.logging) console.log("Checking", collectionName);
            if(this.opts.collectionOverrides){
                collectionOpts = {
                    ...collectionOpts,
                    ...this.opts.collectionOverrides[collectionName]
                }
            }
            // TODO: fix types here
            try{
              await this.client.collections().create(collectionOpts as any);
            }catch(ex){
              // already exists
              // await this.client.collections(collectionOpts["name"]).update({
              //  fields: collectionOpts.fields
              // } as any);
              if(this.opts.logging) console.log(ex);
              if(!ex.toString().includes("409") &&
                 !ex.toString().includes("already exists") &&
                 !ex.toString().includes("ObjectAlreadyExists: Request failed with HTTP code 409")) throw ex;
            }
        }));
    }

    normalizeItem(item: Item): Item{
        if(!item.id){
            if(!this.opts.noInternalID){
                item.id = urlAsID(item.uri);
            }
        }
        item.uri = normalizeUrl(item.uri,normalizerOpts);
        if(!item.flags){
            item.flags = [];
        }
        if(!item.points){
            item.points = 0;
        }
        if(!item.time_indexed){
            item.time_indexed = Date.now();
        }
        return item;
    }

    async addItem(item: any, collectionName: string = this.defaultCollection){
        item = this.normalizeItem(item);
        await this.client.collections(collectionName).documents().upsert(item);
    }

    async addItems(items: Item[], collectionName: string = this.defaultCollection){
        items = items.map(this.normalizeItem);
        await this.client.collections(collectionName).documents().import(items,{
            action: "emplace"
        });
    }
    
    /**
     * This assumes you have not disabled the internal id generator. 
     *
     * @param {string} url
     * @memberof Searcher
     */
    async getByUrl(url: string, collectionName: string = this.defaultCollection){
        const id = urlAsID(url);
        return this.getByID(id);
    }

    async getByID(id: string, collectionName: string = this.defaultCollection){
        return await this.client.collections(collectionName).documents(id).retrieve();
    }

    async deleteByUrl(url: string, collectionName: string = this.defaultCollection){
        await this.deleteByID(urlAsID(url), collectionName);
    }

    async deleteByID(id: string, collectionName: string = this.defaultCollection){
        await this.client.collections(collectionName).documents(id).delete();
    }

    async searchRaw(opts: SearchParamsExtended){
        if(this.opts.logging) console.log("Searching using ",opts.collectionName || this.defaultCollection);
        const collection = this.client.collections(opts.collectionName || this.defaultCollection);
        const docs = collection.documents();
        return docs.search(opts);
    }

    async search(query: string, opts: any){
        return (await this.searchRaw({
            collectionName: opts.collectionName || this.defaultCollection,
            q: query,
            query_by: ["title","desc","page_keywords"].join(","), // string[] is comma seperated list?
            query_by_weights: "3,1,2",
            sort_by: "points:desc,time_indexed:desc",
            ...opts
        }));
    }
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    // main!
    (await import("dotenv")).config();
    const createServer = (await import ("./server.js")).default;
    const searcher = new Searcher({
        logging: true
    });
    searcher.init().then(() => {
        console.log("Searcher Initalized, starting server");
        createServer(searcher).listen(process.env.PORT || 3000, () => console.log("Search service listening on port 3000. "));
    });
}

export default Searcher;
export {Searcher,normalizerOpts,urlAsID};