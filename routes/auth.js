import { Router } from 'express';
import { USERS_BD } from '../bbdd.js';

const authRouter = Router();

//public endpoint, unauthenticated and unauthorized
authRouter.post('/public', (request, response) => response.send("Public endpoint"));

//private endpoint, authenticated
authRouter.post('/authenticated', (request, response) => { 
    const { email, password } = request.body;
    if (!email || !password) return response.status(400).send();
    const user = USERS_BD.find((user) => (user.email === email && user.password === password));
    if (!user) return response.status(401).send();
    return response.send(('User %s authenticated', user));
});

//private endpoint, authenticated and authorized
authRouter.post('/authorized', (request, response) => { 
    const { email, password } = request.body;
    if (!email || !password) return response.status(400).send();
    const user = USERS_BD.find((user) => user.email === email && user.password === password);
    if (!user) return response.status(401).send();
    if (user.rol !== 'admin') return response.status(403).send();
    return response.send(('User %s authorized', user.name));
});

export default authRouter;
