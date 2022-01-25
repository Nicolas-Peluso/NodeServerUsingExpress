// Express Arquivos Declarações
const express = require("express")
const cors = require("cors")
const app = express()
const Port = 4000
const fs = require("fs")
let TempName = ""

const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/public/picture')
    },
    filename: (req, file, cb) => {
        const extensão = file.originalname.split('.')[1]

        const NomeNovoFile = require("crypto")
            .randomBytes(64)
            .toString('hex')

        cb(null, `${NomeNovoFile}.${extensão}`)
        TempName = `${NomeNovoFile}.${extensão}`
    }
})
const Upload = multer({ storage })

const JsonWebToken = require("jsonwebtoken")
require("dotenv-safe").config()

//Funções COmplementares
function WriteingInFile(caminho, arquivo) {
    fs.writeFile(
        caminho,
        JSON.stringify(arquivo, null, 1),
        () => {
            return true
        }
    )
}

function JWTVerify(req, res, next) {
    const tokenCru = req.headers['authorization']
    const token = tokenCru.split(' ')[1]
    if (!token) return res.json({ "message": "Token nao recebido" })
    JsonWebToken.verify(token, process.env.SECRET, (err, decode) => {
        if (err) return res.json({ "message": "falha na autenticação" })

        next()
    })
}

//Class UserCadastro
const User = require("./Cadastro/UserCadastro.js")
const UserCadastro = new User(WriteingInFile)

//Class Cadstro de Postagem 
const PostagemCadastro = require("./cadastrarPostagem/cadastrarPOstagem.js")
const Postagem = new PostagemCadastro(WriteingInFile)

//Class Login
const Login = require("./LoginUSer/Login.js")
const LoginUser = new Login(JsonWebToken)

//COnfigurando Padrao
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
app.use(express.static("public"))

//Rotas
//Criar um usuario
app.post("/user/register", Upload.single("Avatar"), (req, res) => {
    //Definindo o tipo de Conteudo que deve ser recebido aqui
    res.contentType("application/json")
    //Definindo qual aplicação pode fazer requisições nesse caso qualquer uma
    res.header("Access-Control-Allow-Origin", "*")
    //Recebndo os parametros em forma de json da requisição
    UserCadastro.PostarUser(req, res, TempName)
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

//Postagens Rotas
app.post("/postagem", JWTVerify, Upload.single("foto"), (req, res, next) => {

    Postagem.PostarPostagem(req, res, TempName)
})

app.get("/postagem/get", (req, res) => {
    Postagem.SendPostagens(res)
})

//USerLogin
app.post("/login", (req, res) => {
    LoginUser.LoginValidete(req, res)
})

app.listen(Port, () => {
    console.log("Conexão Estabelecida na porta " + Port)
})