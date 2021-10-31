import { Request, Response } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';

class AuthenticateUserController {
    async handle(req: Request, res: Response){

        //controlador para a requisição de autenticação
        const { code } = req.body;

        const service = new AuthenticateUserService();
        try {
            const result = await service.execute(code)
            return res.json(result)
        } catch (err) {
            return res.json(err.message);
        }
        
    }
}

export { AuthenticateUserController }