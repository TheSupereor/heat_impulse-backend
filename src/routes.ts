import { Router } from 'express';
import { ensureAuthenticated } from './middleware/ensureAuthenticated';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { Get3MessagesController } from './controllers/Get3MessagesController';
import { ProfileUserController } from './controllers/ProfileUserController';

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);

//garantir a autenticação do usuário com o ensureAuthenticated
router.post("/messages", ensureAuthenticated, new CreateMessageController().handle)

router.get("/messages/last3", new Get3MessagesController().handle)

router.get("/profile", ensureAuthenticated, new ProfileUserController().handle)

export { router };