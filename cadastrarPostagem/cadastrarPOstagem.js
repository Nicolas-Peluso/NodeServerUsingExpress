module.exports = class Cadastrar {
    constructor(WriteingInFile) {
        this.WriteingInFile = WriteingInFile
        this.POstagemRegister = require("../src/Postagem/Postagem.json")
        this.usersRegister = require("../src/User/user.json")
        this.path = require("path")
    }

    PostarPostagem(req, res, Name) {
        try {
            const { Descricao, Id } = req.body

            let UserPoster = this.usersRegister.users.reduce((acc, curr) => {
                curr.id == Id ? acc["User"] = [{ avatar: curr.Avatar, Nome: curr.UserName }] : null
                return acc
            }, { User: null })

            this.POstagemRegister.Postagem.push({ Descrição: Descricao, Foto: "http://localhost:4000/picture/" + Name, UserPoster: UserPoster.User })

            this.WriteingInFile(this.path.join(__dirname, '../src/Postagem/Postagem.json'), this.POstagemRegister)
            res.json({ "message": "Postagem Feita Com Sucesso" })
            Name = ""
        }
        catch (err) {
            res.json({ "message": err })
        }
    }

    SendPostagens(res) {
        res.json(this.POstagemRegister)
    }
}