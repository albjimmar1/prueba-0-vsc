import createExpressServer from 'express';
import { USERS_BD } from '../bbdd.js';

const accountRouter = createExpressServer.Router();

/*accountRouter.use((request, response, next) => { 

    next();
});*/

accountRouter.get("/:guid", (request, response) => {
    const { guid } = request.params;
    const user = USERS_BD.find(user => user.guid === guid);
    if (!user) return response.status(404).send();
    return response.send(user);
});

accountRouter.post('/', (request, response) => {
    const { guid, name } = request.body;
    if (!guid || !name) return response.status(400).send();
    const user = USERS_BD.find(user => user.guid === guid);
    if (user) return response.status(409).send();
    USERS_BD.push({
        guid, name
    });
    return response.send();
});

accountRouter.patch('/:guid', (request, response) => {
    const { guid } = request.params;
    const { name } = request.body;
    if (!name) return response.status(400).send();
    const user = USERS_BD.find(user => user.guid === guid);
    if (!user) return response.status(404).send();
    user.name = name;
    return response.send();
});

accountRouter.delete('/:guid', (request, response) => {
    const { guid } = request.params;
    const userIndex = USERS_BD.findIndex(user => user.guid === guid);
    if (userIndex === -1) return response.status(404).send();
    USERS_BD.splice(userIndex, 1);
    return response.send();
});

export default accountRouter;
