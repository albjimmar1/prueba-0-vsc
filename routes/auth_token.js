import { Router } from 'express';
import { USERS_BD } from '../bbdd.js';
import { SignJWT, jwtVerify } from 'jose';
import validateLoginDTO from '../dto/validate_login_dto.js';

const authTokenRouter = Router();

//log in
authTokenRouter.post('/login', validateLoginDTO, async (request, response) => { 
    const { email, password } = request.body;

    if (!email || !password) response.status(400).send();
    const user = USERS_BD.find((user) => user.email === email && user.password === password);
    if (!user) response.status(401).send();
    const guid = user.guid;
    const jwtConstructor = new SignJWT({ guid });
    const encoder = new TextEncoder();
    const jwt = await jwtConstructor
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
    return response.send(jwt);
});

//authenticated request with token to get the user profile
authTokenRouter.get('/profile', async (request, response) => {
    // get token and check authenticity and caducity
    const { authorization } = request.headers;
    if (!authorization) return response.status(401).send();
    try {
        const encoder = new TextEncoder();
        const { payload } = await jwtVerify(authorization, encoder.encode(process.env.JWT_PRIVATE_KEY));
        const user = USERS_BD.find((user) => user.guid === payload.guid);
        if (!user) return response.status(401).send();
        delete user.password;
        return response.send(user);
    } catch(err) {
        return response.status(401).send();
    }
});

export default authTokenRouter;
