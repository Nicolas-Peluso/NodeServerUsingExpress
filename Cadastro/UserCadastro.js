module.exports = class UserCadastro {
    constructor() {
        this.fs = require("fs")
        this.path = require("path")
        this.userRegister = require("../src/User/user.json")
        this.MD5Encripter = require("md5")
    }

    WriteingInFile() {
        this.fs.writeFile(
            this.path.join(__dirname, "../src/User/user.json"),
            JSON.stringify(this.userRegister, null, 1),
            () => {
                return true
            }
        )
    }

    PostarUser(req, res) {
        try {
            const Nome = req.body.Nome
            const Email = req.body.Email
            let Senha = req.body.Senha
            const id = Math.floor(Math.random() * (30000 - 0 + 1)) + 1
            //verificando o corpo da requisisao
            if (req.body == {} || Nome === "" || Email === "" || Senha === "") throw new Error("Algum Dos Campos Estão Vazio")
            if (typeof Nome !== "string" || typeof Email !== "string") throw new Error("Email ou Nome devem ser string")

            //Verificar se o usuario existe No banco
            let HasUser = this.userRegister.users.reduce((acc, curr) => {
                curr.Email == Email ? acc["Email"] = Email : null
                return acc
            }, { Email: null })

            if (HasUser.Email !== null) throw new Error("Email Ja existe")
            //Inserindo No arquivo json 
            this.userRegister.users.push({ Nome, Email, Senha: this.MD5Encripter(Senha), id })

            this.WriteingInFile()

            res.status(200).json({ "message": "usuario cadastrado" })
        } catch (err) {
            res.json({ "message": `${err}` })
        }
    }

    EditUser(req, res) {
        try {
            const Email = req.body.Email
            const Senha = req.body.Senha
            let NewSenha = req.body.NovaSenha
            const NewEmail = req.body.NovoEmail
            if (Email === "" || Senha === "") throw new Error("Prencha todos os campos")
            if (typeof Email !== "string" || typeof NewEmail !== "string") throw new Error("Email e/ou novo Email devem ser string")

            //Verificar se o usuario existe No banco
            let HasUser = this.userRegister.users.reduce((acc, cur, index) => {
                cur.Email == Email ? acc.Email = cur.Email : null
                this.MD5Encripter(Senha) == cur.Senha ? acc.Senha = this.MD5Encripter(cur.Senha) : null
                acc.Index = index
                return acc
            }, { Email: null, Senha: null, newSenha: this.MD5Encripter(NewSenha), newEmail: NewEmail })
            //se o usuario nao bater com algum do banco
            if (HasUser.Email == null) throw new Error("Email Incorreto")
            if (HasUser.Senha == null) throw new Error("Senha Incorreta")

            //Alterando usuario no banco
            const keys = ["Email", "Senha"]
            keys.forEach(key => this.userRegister.users[HasUser.Index][key] = HasUser["new" + key])

            this.WriteingInFile()

            return res.json({ "message": "Usuario Editado com sucesso" })
        }
        catch (err) {
            res.json({ "message": `${err}` })
        }
    }
    DeleteUser(req, res) {
        try {
            const Email = req.body.Email
            const Senha = req.body.Senha

            if (Email === "" || Senha === "") throw new Error("Prencha todos os campos")
            //se o usuario nao bater com algum do banco
            let HasUser = this.userRegister.users.reduce((acc, cur, Index) => {
                cur.Email == Email ? acc.Email = Email : null
                cur.Senha == this.MD5Encripter(Senha) ? acc.Senha = Senha : null
                if (acc.Email && acc.Senha) acc.Index = Index
                return acc
            }, { Email: null, Senha: null })

            if (HasUser.Email == null) throw new Error("Email Nao Registrado")
            if (HasUser.Senha == null) throw new Error("senha invalida")
            delete this.userRegister.users[HasUser.Index]

            this.WriteingInFile()

            res.json({ "message": "Usuario Deletado" })
        } catch (err) {
            res.json({ "message": `${err}` })
        }
    }
}