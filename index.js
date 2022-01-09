// Express Arquivos Declarações
const express = require("express")
const cors = require("cors")
const app = express()
const Port = 4000

//Adicionais Declarações
const fs = require("fs")
const path = require("path")
const userRegister = require("./src/User/user.json")
const MD5Encripter = require("md5")

//COnfigurando Padrao
app.use(express.json())
app.use(cors())

//Funções
function WriteingInFile() {
    fs.writeFile(
        path.join(__dirname + "/src/User/user.json"),
        JSON.stringify(userRegister, null, 1),
        (err) => {
            if (err) throw new Error
            return true
        }
    )
}

function VerifyIfUserExist(Email) {

}

//Rotas
//Criar um usuario
app.post("/user/register", (req, res) => {
    //Definindo o tipo de Conteudo que deve ser recebido aqui
    res.contentType("application/json")
    //Definindo qual aplicação pode fazer requisições nesse caso qualquer uma
    res.header("Access-Control-Allow-Origin", "*")
    //Recebndo os parametros em forma de json da requisição
    try {
        const Nome = req.body.Nome
        const Email = req.body.Email
        let Senha = req.body.Senha
        const id = Math.floor(Math.random() * (30000 - 0 + 1)) + 1

        //verificando o corpo da requisisao
        if (req.body == {} || Nome === "" || Email === "" || Senha === "") throw new Error("Email ou Nome Vazio")
        if (typeof Nome !== "string" || typeof Email !== "string") throw new Error("Email ou Nome devem ser string")

        if (userRegister.users[Email]) throw new Error("Email ja cadastrado")
        //Inserindo No arquivo json 
        userRegister.users[Email] = { Nome, Email, Senha: MD5Encripter(Senha), id }

        WriteingInFile()

        res.status(200).json({ "message": "usuario cadastrado" })
    } catch (err) {
        res.json({ "message": `${err}` })
    }
})
//Editar usuario
app.put("/user/Edit", (req, res) => {
    try {
        const Email = req.body.Email
        const Senha = req.body.Senha
        let NewSenha = req.body.NovaSenha
        const NewEmail = req.body.NovoEmail
        if (Email === "" || Senha === "") throw new Error("Prencha todos os campos")
        if (typeof Email !== "string" || typeof NewEmail !== "string") throw new Error("Email e/ou novo Email devem ser string")
        //Verificar se o usuario existe No banco

        //se o usuario nao bater com algum do banco
        if (userRegister.users[Email] == null) throw new Error("Email invalido")
        if (userRegister.users[Email].Senha !== MD5Encripter(Senha)) throw new Error("senha invalida")
        //Alterando usuario no banco
        let keys = ["Email", "Senha"]
        keys.forEach(key => {
            userRegister.users[Email][key] = key === "Senha" ? MD5Encripter(NewSenha) : NewEmail
        })
        WriteingInFile()
        return res.json({ "message": "Usuario Editado com sucesso" })
    }
    catch (err) {
        res.json({ "message": `${err}` })
    }
})

app.delete("/user/delete", (req, res) => {
    try {
        const Email = req.body.Email
        const Senha = req.body.Senha

        if (Email === "" || Senha === "") throw new Error("Prencha todos os campos")
        //se o usuario nao bater com algum do banco
        if (userRegister.users[Email] == null) throw new Error("Email Nao Registrado")
        if (userRegister.users[Email].Senha !== MD5Encripter(Senha)) throw new Error("senha invalida")

        delete userRegister.users[Email]
        WriteingInFile()

        res.json({ "message": "Usuario Deletado" })
    } catch (err) {
        res.json({ "message": `${err}` })
    }
})

app.listen(Port, () => {
    console.log("Conexão Estabelecida na porta " + Port)
})