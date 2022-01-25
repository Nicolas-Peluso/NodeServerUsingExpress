module.exports = class Cadastrar {
    constructor(WriteingInFile) {
        this.WriteingInFile = WriteingInFile
        this.POstagemRegister = require("../src/Postagem/Postagem.json")
        this.path = require("path")
    }

    PostarPostagem(req, res, Name) {
        try {
            console.log(req.body)
            const { Descricao } = req.body
            this.POstagemRegister.Postagem.push({ Descrição: Descricao, Foto: "http://localhost:4000/picture/" + Name })

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