import Typesense from "typesense";
import {defaultSchema} from "./schemas.js";

import url from 'url'

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
            }
        }));
    }
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    // main!
    (await import("dotenv")).config();
    const createServer = (await import ("./server.js")).default;
    const searcher = new Searcher();
    searcher.init().then(() => {
      createServer(searcher).listen(process.env.PORT || 3000, () => console.log("Search service listening on port 3000. "));
    });
}

export default Searcher;
export {Searcher};