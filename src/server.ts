import express from "express";

import type {Searcher} from "./main.js";

export default function createServer(searcher: Searcher){
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("OK!");
    });

    app.get("/search", (req, res) => {
        res.send("TODO");
    });
    
    return app;
}