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
                curr.id == Id ? acc["User"] = [{ avatar: curr.Avatar, Author: curr.UserName }] : null
                return acc
            }, { User: null })

            this.POstagemRegister.Postagem.push({
                Descrição: Descricao,
                Foto: "http://localhost:4000/picture/" + Name,
                UserPoster: UserPoster.User,
                IdPostagem: Math.floor(Math.random() * (30000 - 0 + 1)) + 1,
                Name: Name
            })

            this.WriteingInFile(this.path.join(__dirname, '../src/Postagem/Postagem.json'), this.POstagemRegister)
            res.json({ "message": "Postagem Feita Com Sucesso", sucess: true })
            Name = ""
        }
        catch (err) {
            res.json({ "message": err })
        }
    }

    SendPostagens(res) {
        res.json(this.POstagemRegister)
    }

    SendPOstagensByUser(req, res) {
        try {
            const { Author } = req.body
            if (Author == undefined || Author == "") throw new Error("Houve um problema na leitura verifique os dados enviados e tente novamente")

            const PostsForUser = this.POstagemRegister.Postagem.reduce((acc, cur) => {
                cur.UserPoster[0].Author === Author ? acc.push(cur) : null
                console.log(acc)
                return acc
            }, [])

            if (PostsForUser.length)
                res.json({
                    "Postagens": PostsForUser,
                    "Total": PostsForUser.length
                })
            else
                res.json({ "messgae": 0 })

        } catch (e) {
            res.json({ "message": `${e}` })
        }
    }

    DeletePostagem(req, res) {
        try {
            const { Author, Nome } = req.body
            if (Author === undefined || Nome === undefined) throw new Error("Algum dos campos estao vazios")

            const PostagePertenceAoUsuario = this.POstagemRegister.Postagem.reduce((acc, cur, Index) => {
                if (Nome == cur.Name) {
                    if (Author == cur.UserPoster[0].Author) {
                        acc.Pertence = true
                        this.POstagemRegister.Postagem.splice(Index)
                    }
                }
                return acc
            }, { Pertence: false })
            if (PostagePertenceAoUsuario.Pertence === false) throw new Error("A postagem nao Pertence ao usuario Ou nao")

            this.WriteingInFile(this.path.join(__dirname, '../src/Postagem/Postagem.json'), this.POstagemRegister)
            res.json({ "message": "POstagem Deletada com Sucesso" })
        }
        catch (err) {
            res.json({ "message": `${err}` })
        }
    }
}