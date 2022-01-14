module.exports = class Cadastrar {
    constructor(WriteingInFile) {
        this.WriteingInFile = WriteingInFile
        this.POstagemRegister = require("../src/Postagem/Postagem.json")
        this.path = require("path")
    }

    PostarPostagem(req, res, Name) {
        try {
            const { Descricao } = req.body

            this.POstagemRegister.Postagem.push({ Descrição: Descricao, Foto: Name })

            this.WriteingInFile(this.path.join(__dirname, '../src/Postagem/Postagem.json'), this.POstagemRegister)
            res.json({ "message": "Postagem Feita Com Sucesso" })
        }
        catch (err) {
            res.json({ "message": err })
        }
    }

    SendPostagens(res) {
        res.json(this.POstagemRegister)
    }
}