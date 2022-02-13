module.exports = class PercorrerElementos {
    constructor() {
        this.MD5Encripter = require("md5")

    }
    VerirficarSeEmailOuSenhaSaoValidos(Lista, Email, Senha) {
        let LoginVerify = Lista.reduce((acc, cur, index) => {
            cur.Email == Email ? acc.Email = cur.Email : null
            this.MD5Encripter(Senha) == cur.Senha ? acc.Senha = this.MD5Encripter(cur.Senha) : null

            if (acc.Email && acc.Senha && acc.Index === null) acc.Index = index
            return acc
        }, { Email: null, Senha: null, Index: null })
        return LoginVerify
    }

    VerificarSeEmailEnomeDeUsuarioEstaoDisponiveis(Lista, Email, UserName) {
        let EmailUserNameVerify = Lista.reduce((acc, curr) => {
            curr.Email == Email ? acc["Email"] = Email : null
            curr.UserName == UserName ? acc["userName"] = UserName : null
            return acc
        }, { Email: null, userName: null })
        return EmailUserNameVerify
    }

    VerificaSeèPOssivelAlterarAsenhaEoEmail(Lista, Email, Senha, NewSenha, NewEmail) {
        let VerificationEdit = Lista.reduce((acc, cur, index) => {
            cur.Email == Email ? acc.Email = cur.Email : null
            this.MD5Encripter(Senha) == cur.Senha ? acc.Senha = this.MD5Encripter(cur.Senha) : null
            acc.Index = index
            return acc
        }, { Email: null, Senha: null, newSenha: this.MD5Encripter(NewSenha), newEmail: NewEmail })

        return VerificationEdit
    }

    VerificaSePossoDeletarUmUsuario(Lista, Email, Senha) {
        let Delete = Lista.reduce((acc, cur, Index) => {
            cur.Email == Email ? acc.Email = Email : null
            cur.Senha == this.MD5Encripter(Senha) ? acc.Senha = Senha : null
            if (acc.Email && acc.Senha) acc.Index = Index
            return acc
        }, { Email: null, Senha: null })
        return Delete
    }
}