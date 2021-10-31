import { serverHTTP } from "./app"

serverHTTP.listen(4000, () => {
    console.log('Server rodando na porta 4000')
})