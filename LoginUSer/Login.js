module.exports = class Login {
    constructor(JsonWebToken, wireteInfile) {
        this.userRegister = require("../src/User/user.json")
        this.MD5Encripter = require("md5")
        this.wireteInfile = wireteInfile
        this.path = require("path")

        this.IteratorObj = require("../helper/PercorrerElementos.js")
        this.Iterator = new this.IteratorObj()

        this.JsonWebToken = JsonWebToken
        require("dotenv-safe").config()

    }

    LoginValidete(req, res) {
        try {
            const { Email, Senha } = req.body
            let HasUser = this.Iterator.VerirficarSeEmailOuSenhaSaoValidos(this.userRegister.users, Email, Senha)

            if (HasUser.Email === null) throw new Error("Email Invalido")
            if (HasUser.Senha === null) throw new Error("Senha Invalida")

            const Id = this.userRegister.users[HasUser.Index].id
            let Token = this.JsonWebToken.sign({ Id }, process.env.SECRET, {
                expiresIn: 1200
            })

            this.userRegister.users[HasUser.Index].TOKEN = Token
            this.wireteInfile(this.path.join(__dirname, "../src/User/user.json"), this.userRegister)
            console.log(HasUser)
            res.json({
                "message": "Usuario Logado Com Sucesso",
                "TOKEN": Token,
                "Id": Id,
                "UserName": this.userRegister.users[HasUser.Index].UserName,
                "Avatar": this.userRegister.users[HasUser.Index].Avatar
            })
        }
        catch (err) {
            res.json({ "message": `${err}` })
        }
    }

    LoginWithToken(req, res) {
        try {
            const tokenCru = req.headers['authorization']
            const token = tokenCru.split(' ')[1]

            const ValideteToken = this.userRegister.users.map(user => {
                if (user.TOKEN === token) {
                    res.json({
                        "message": "Usuario Logado Com Sucesso",
                        "TOKEN": token,
                        "Id": user.id,
                        "UserName": user.UserName,
                        "Avatar": user.Avatar
                    })
                }
            })
            if (!!ValideteToken === false) throw new Error("usuario Nao Encontrado ou token invalido ")
        } catch (e) {
            res.json({ "message": `${e}` })
        }
    }
}