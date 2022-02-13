module.exports = class UserCadastro {
    constructor(WriteingInFile) {
        this.userRegister = require("../src/User/user.json")
        this.MD5Encripter = require("md5")
        this.WriteingInFile = WriteingInFile
        this.path = require("path")

        this.iteratorObj = require("../helper/PercorrerElementos.js")
        this.iterator = new this.iteratorObj()

    }

    PostarUser(req, res, TempName) {
        try {
            const { Nome, Email, Senha, UserName } = req.body
            const id = Math.floor(Math.random() * (30000 - 0 + 1)) + 1
            //verificando o corpo da requisisao
            if (req.body == {} || Nome === "" || Email === "" || Senha === "") throw new Error("Algum Dos Campos Estão Vazio")
            if (typeof Nome !== "string" || typeof Email !== "string") throw new Error("Email ou Nome devem ser string")

            //Verificar se o usuario existe No banco
            let HasUser = this.iterator.VerificarSeEmailEnomeDeUsuarioEstaoDisponiveis(this.userRegister.users, Email, UserName)

            if (HasUser.Email !== null) throw new Error("Email Ja existe")
            if (HasUser.userName !== null) throw new Error("nome De Usuario Ja existe tente outro")
            //Inserindo No arquivo json 
            this.userRegister.users.push({
                Nome,
                Email,
                Senha: this.MD5Encripter(Senha),
                id,
                Avatar: "http://localhost:4000/picture/" + TempName,
                UserName,
                TOKEN: null
            })
            TempName = ""
            this.WriteingInFile(this.path.join(__dirname, "../src/User/user.json"), this.userRegister)

            res.status(200).json({ "message": "usuario cadastrado" })
        } catch (err) {
            res.json({ "message": `${err}` })
        }
    }

    EditUser(req, res) {
        try {
            const { Email, Senha, NewEmail, NewSenha } = req.body

            if (Email === "" || Senha === "") throw new Error("Prencha todos os campos")
            if (typeof Email !== "string" || typeof NewEmail !== "string") throw new Error("Email e/ou novo Email devem ser string")

            //Verificar se o usuario existe No banco
            let HasUser = this.iterator.VerificaSeèPOssivelAlterarAsenhaEoEmail(this.userRegister.users, Email, Senha, NewEmail, NewSenha)
            //se o usuario nao bater com algum do banco
            if (HasUser.Email == null) throw new Error("Email Incorreto")
            if (HasUser.Senha == null) throw new Error("Senha Incorreta")

            //Alterando usuario no banco
            const keys = ["Email", "Senha"]
            keys.forEach(key => this.userRegister.users[HasUser.Index][key] = HasUser["new" + key])

            this.WriteingInFile(this.path.join(__dirname, "../src/User/user.json"), this.userRegister)
            return res.json({ "message": "Usuario Editado com sucesso" })
        }
        catch (err) {
            res.json({ "message": `${err}` })
        }
    }
    DeleteUser(req, res) {
        try {
            const { Email, Senha } = req.body

            if (Email === "" || Senha === "") throw new Error("Prencha todos os campos")
            //se o usuario nao bater com algum do banco
            let HasUser = this.iterator.VerificaSePossoDeletarUmUsuario(this.userRegister.users, Email, Senha)

            if (HasUser.Email == null) throw new Error("Email Nao Registrado")
            if (HasUser.Senha == null) throw new Error("senha invalida")

            this.userRegister.users.splice(HasUser.Index)

            this.WriteingInFile(this.path.join(__dirname, "../src/User/user.json"), this.userRegister)
            res.json({ "message": "Usuario Deletado" })
        } catch (err) {
            res.json({ "message": `${err}` })
        }
    }
}