interface caracter {
    token: string,
    lexema: string,
}

export default class caracteres{

    private caracteres:caracter[] = [
        {
            token: 'funct',
            lexema: 'function',
        },
        {
            token: "=",
            lexema: "Equal_To"
        },
        {
            token: "(",
            lexema: "("
        },
        {
            token: "(",
            lexema: ")"
        },
        {
            token: "+",
            lexema: "Add"
        },
        {
            token: "-",
            lexema: "substract"
        },
        {
            token: "/",
            lexema: "Divide"
        },
        {
            token: "*",
            lexema: "multiply"
        },
        {
            token: "return",
            lexema: "return"
        },
        {
            token: "if",
            lexema: "COND_IF"
        },
        {
            token: "else",
            lexema: "COND_ELSE"
        },
        {
            token: "==",
            lexema: "COND_EQUAL"
        },
        {
            token: ">",
            lexema: "COND_>"
        },
        {
            token: "<",
            lexema: "COND_<"
        },
        {
            token: "=",
            lexema: "="
        },

    ]

    getCaracteres(){
        return this.caracteres;
    }

}