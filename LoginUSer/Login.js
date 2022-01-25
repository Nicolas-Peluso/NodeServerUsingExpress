module.exports = class Login {
    constructor(JsonWebToken) {
        this.userRegister = require("../src/User/user.json")
        this.MD5Encripter = require("md5")

        this.JsonWebToken = JsonWebToken
        require("dotenv-safe").config()
    }

    LoginValidete(req, res) {
        try {
            const { Email, Senha } = req.body

            let HasUser = this.userRegister.users.reduce((acc, cur, index) => {
                cur.Email == Email ? acc.Email = cur.Email : null
                this.MD5Encripter(Senha) == cur.Senha ? acc.Senha = this.MD5Encripter(cur.Senha) : null
                acc.Index = index
                return acc

            }, { Email: null, Senha: null })

            if (HasUser.Email === null) throw new Error("Email Invalido")
            if (HasUser.Senha === null) throw new Error("Senha Invalida")
            console.log(HasUser)
            const Id = this.userRegister.users[HasUser.Index].id
            let Token = this.JsonWebToken.sign({ Id }, process.env.SECRET, {
                expiresIn: 1200
            })

            res.json({ "message": "Usuario Logado Com Sucesso", "TOKEN": Token, "Id": Id })
        }
        catch (err) {
            res.json({ "message": `${err}` })
        }

    }
}