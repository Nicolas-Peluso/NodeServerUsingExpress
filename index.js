// Express Arquivos Declarações
const express = require("express")
const cors = require("cors")
const app = express()
const Port = 4000

//Class UserCadastro
const User = require("./Cadastro/UserCadastro.js")
const UserCadastro = new User()

//COnfigurando Padrao
app.use(express.json())
app.use(cors())

//Rotas
//Criar um usuario
app.post("/user/register", (req, res) => {
    //Definindo o tipo de Conteudo que deve ser recebido aqui
    res.contentType("application/json")
    //Definindo qual aplicação pode fazer requisições nesse caso qualquer uma
    res.header("Access-Control-Allow-Origin", "*")
    //Recebndo os parametros em forma de json da requisição
    UserCadastro.PostarUser(req, res)
})
//Editar usuario
app.put("/user/Edit", (req, res) => {
    //Definindo o tipo de Conteudo que deve ser recebido aqui
    res.contentType("application/json")
    //Definindo qual aplicação pode fazer requisições nesse caso qualquer uma
    res.header("Access-Control-Allow-Origin", "*")
    UserCadastro.EditUser(req, res)
})

app.delete("/user/delete", (req, res) => {
    //Definindo o tipo de Conteudo que deve ser recebido aqui
    res.contentType("application/json")
    //Definindo qual aplicação pode fazer requisições nesse caso qualquer uma
    res.header("Access-Control-Allow-Origin", "*")
    UserCadastro.DeleteUser(req, res)
})

app.listen(Port, () => {
    console.log("Conexão Estabelecida na porta " + Port)
})