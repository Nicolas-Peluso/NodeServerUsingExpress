const express = require("express")
const app = express()
const Port = 4000

//COnfigurando Padrao
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.listen(Port, () => {
    console.log("Conexão Estabelecida na porta " + Port)
})