//const operations = require("./operations");
//console.log(operations.sum(1, 2));

//import dotenv from 'dotenv';
//import { createServer } from 'http';
import createExpressServer from 'express';
import accountRouter from './routes/account.js';

//dotenv.config();

const PORT = process.env.PORT || 3000;
const express = createExpressServer();

express.use(createExpressServer.json());
express.use(createExpressServer.text());

express.use("/account", accountRouter);

express.listen(PORT, () =>
    console.log('Server on port ${PORT}')
);

/*express.get("/account/:idAccount", (request, response) => {
    console.log(request.params);
    console.log(request.body);
    response.sendStatus("Your personal account");
})*/

/*
const httpServer = createServer((request, response) => {
    //console.log(request.method);
    //console.log(request.url);
    //console.log(request.headers);
    let data = '';
    let chunkIndex = 0;
    request.on('data', (chunk) => { 
        data += chunk;
        chunkIndex++;
        console.log(chunkIndex);
    })
    request.on('end', () => { 
        //console.log(data);
        response.end("Received");
    })
});

httpServer.listen(3000);*/