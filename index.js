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

//Rotas
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
        //verificando o corpo da requisisao
        if (req.body == {} || Nome === "" || Email === "" || Senha === "") throw new Error("Email ou Nome Vazio")
        if (typeof Nome !== "string" || typeof Email !== "string") throw new Error("Email ou Nome devem ser string")
        //Inserindo No arquivo json 
        userRegister.users.push({ Nome, Email, Senha: MD5Encripter(Senha) })
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

        if (Email === "" || Senha === "" || NewSenha === "" || NewEmail === "") throw new Error("Prencha todos os campos")
        if (typeof Email !== "string" || typeof NewEmail !== "string") throw new Error("Email e/ou novo Emaild deven ser string")
        //Verificar se o usuario existe No banco
        let HasUser = userRegister.users.reduce((acc, cur, index) => {
            cur.Email == Email ? acc.Email = cur.Email : null
            MD5Encripter(Senha) == cur.Senha ? acc.Senha = MD5Encripter(cur.Senha) : null
            acc.Index = index
            return acc
        }, { Email: null, Senha: null, newSenha: MD5Encripter(NewSenha), newEmail: NewEmail })
        //se o usuario nao bater com algum do banco
        if (HasUser.Email == null) throw new Error("Email invalido")
        if (HasUser.Senha == null) throw new Error("senha invalida")
        //Alterando usuario no banco
        let keys = ["Email", "Senha"]
        keys.forEach(key => userRegister.users[HasUser.Index][key] = HasUser["new" + [key]])
        WriteingInFile()

        return res.json({ "message": "Usuario Editado com sucesso" })

    }
    catch (err) {
        res.json({ "message": `${err}` })
    }
})


app.listen(Port, () => {
    console.log("Conexão Estabelecida na porta " + Port)
})