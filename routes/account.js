import { Router } from 'express';
import { USERS_BD } from '../bbdd.js';
import userModel from '../schemas/user-schema.js';

const accountRouter = Router();

//Middleware ip log
accountRouter.use((request, response, next) => { 
    console.log(request.ip);
    next();
});

//Get a user
accountRouter.get('/:guid', async (request, response) => {
    const { guid } = request.params;
    //const user = USERS_BD.find(user => user.guid === guid);
    const user = await userModel.findById(guid);
    if (!user) return response.status(404).send();
    return response.send(user);
});

//Create a user 
accountRouter.post('/', async (request, response) => {
    const { guid, name } = request.body;
    if (!guid || !name) return response.status(400).send();
    //const user = USERS_BD.find(user => user.guid === guid);
    const user = await userModel.findById(guid).exec();
    if (user) return response.status(409).send("User is already registered");
    //USERS_BD.push({  guid, name });
    const newUser = new userModel({ _id: guid, name: name });
    await newUser.save();
    return response.send();
});

//Modify a user
accountRouter.patch('/:guid', async (request, response) => {
    const { guid } = request.params;
    const { name } = request.body;
    if (!name) return response.status(400).send();
    //const user = USERS_BD.find(user => user.guid === guid);
    const user = await userModel.findById(guid);
    if (!user) return response.status(404).send();
    user.name = name;
    await user.save();
    return response.send();
});

//Delete a user
accountRouter.delete('/:guid', async (request, response) => {
    const { guid } = request.params;
    //const userIndex = USERS_BD.findIndex(user => user.guid === guid);
    //if (userIndex === -1) return response.status(404).send();
    //USERS_BD.splice(userIndex, 1);
    const user = modelUser.findById(guid);
    if (!user) return response.status(404).send();
    await user.remove();
    return response.send();
});

export default accountRouter;
