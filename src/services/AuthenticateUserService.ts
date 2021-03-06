// Receber código em string
// Recuperar o acess_token no github
// Verificar se o usuário existe no banco de dados
//  > sim = gerar token
//  > não = coloca no bd e gera token
// retornar token com info do usuário

import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

//interfaces para filtrar informações das respostas
interface IAccessTokenResponse {
    access_token: string
};

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string){
        const url = "https://github.com/login/oauth/access_token";

        //pegando token
        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        })

        //pegando dados do usuário
        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        })

        const { login, id, avatar_url, name } = response.data;

        //achar usuário no banco de dados
        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        });

        //se não existir inserir
        if(!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = sign(
            {
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        );

        return { token, user };
    }
}

export { AuthenticateUserService }