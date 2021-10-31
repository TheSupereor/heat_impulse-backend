import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import { Server } from "socket.io"

import { router } from "./routes";

const app = express();
app.use(cors());

//http subir o server com o websocket
const serverHTTP = http.createServer(app);

//habilitando qualquer origem
const io = new Server(serverHTTP, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    console.log(`Usuário conectado: ${socket.id}`);
})

//Aceitar requisições via JSOn
app.use(express.json());;

//passando as rotas para o router
app.use(router);

app.get("/github", (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get("/signin/callback", (req, res) => {
    const { code } = req.query;

    return res.json(code)
})

export { serverHTTP, io }