import express from "express";

import type {Searcher} from "./main.js";

const MAX_REASONABLE_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 10;

export default function createServer(searcher: Searcher){
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("OK!");
    });

    app.get("/search", async (req, res) => {
        if(!req.query.q){
            res.send("NO QUERY!!!");
        }
        const pageNumber = parseInt(req.query.pageNumber || "1");
        // Clamp!
        let pageSize = Math.max(1, parseInt(req.query.pageSize || DEFAULT_PAGE_SIZE));
        pageSize = Math.min(pageSize, MAX_REASONABLE_PAGE_SIZE);
        res.send((await searcher.search(req.query.q, {
            per_page: pageSize,
            page: pageNumber
        })).hits)
    });
    
    return app;
}