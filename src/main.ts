import Typesense from "typesense";
import {defaultSchema} from "./schemas.js";

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
        this.client = new Typesense.Client({
            apiKey: this.opts.apiKey || process.env.TYPESENSE_API_KEY,
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
            await this.client.collections().create(collectionOpts as any);
        }));
    }
}

export default Searcher;
export {Searcher};