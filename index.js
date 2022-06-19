//const operations = require("./operations");
//console.log(operations.sum(1, 2));

//import { createServer } from 'http';
import 'dotenv/config';
//import dotenv from 'dotenv';
//dotenv.config();
import path from 'path';
import {fileURLToPath} from 'url';
import createExpressServer from 'express';
import cookieParser from "cookie-parser";
import accountRouter from './routes/account.js';
import authRouter from './routes/auth.js';
import authSessionRouter from './routes/auth_session.js';
import authTokenRouter from './routes/auth_token.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const express = createExpressServer();

express.use(cookieParser());
express.use(createExpressServer.json());
express.use(createExpressServer.text());

express.use('/', createExpressServer.static(path.join(__dirname, "/")));

express.get('/', (request, response) => { 
    //return response.send("Working");
    return response.sendFile('./index.html');
});

express.use('/account', accountRouter);
express.use('/auth', authRouter);

express.use('/auth-session', authSessionRouter);
express.use('/auth-token', authTokenRouter);

const bootstrap = async () => { 
    await mongoose.connect(process.env.MONGODB_URL);

    express.listen(PORT, () =>
        console.log('Server on port %d', PORT)
    );
}

bootstrap();

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