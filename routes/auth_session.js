import { Router } from 'express';
import { nanoid } from 'nanoid';
import { USERS_BD } from '../bbdd.js';

const sessions = [];
const authSessionRouter = Router();

//log in
authSessionRouter.post('/login', (request, response) => { 
    const { email, password } = request.body;
    if (!email || !password) response.status(400).send();
    const user = USERS_BD.find((user) => user.email === email && user.password === password);
    if (!user) response.status(401).send();
    const sessionId = nanoid();
    const guid = user.guid;
    sessions.push({ sessionId, guid });
    response.cookie("sessionId", sessionId, {httpOnly: true});
    return response.send(('User %s authenticated', user));
});

//log out
authSessionRouter.post('/logout', (request, response) => { 
    const { email, password } = request.body;
    if (!email || !password) response.status(400).send();
    const user = USERS_BD.find((user) => user.email === email && user.password === password);
    if (!user) response.status(401).send();
    const sessionId = nanoid();
    const guid = user.guid;
    sessions.push({ sessionId, guid });
    response.cookie("sessionId", sessionId, {httpOnly: true});
    return response.send(('User %s authenticated', user));
});

//authenticated request with session to get the user profile
authSessionRouter.get('/profile', (request, response) => {
    const { cookies } = request;
    if (!cookies) return response.status(401).send();
    const userSession = sessions.find((session) => session.sessionId === cookies.sessionId);
    if (!userSession) return response.status(401).send();
    const user = USERS_BD.find((user) => user.guid === userSession.guid);
    if (!user) return response.status(401).send();
    delete user.password;
    return response.send(user);
});

export default authSessionRouter;