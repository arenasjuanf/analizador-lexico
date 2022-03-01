import Tokenizr, { Token } from "tokenizr";
import chalk from 'chalk'; // console colors libry

export default class Analyzer{
    lexer: Tokenizr = new Tokenizr();


    constructor(){
        this.initLexer();
    }

    initLexer(){

        this.lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
            ctx.accept("id")
        })
        this.lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
            ctx.accept("number", parseInt(match[0]))
        })
        this.lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
            ctx.accept("string", match[1].replace(/\\"/g, "\""))
        })
        this.lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, [match]) => {
            ctx.accept("comment", match.replace('//', ""))
        })
        this.lexer.rule(/[ \t\r\n]+/, (ctx, _) => {
            ctx.ignore() // ignore spaces
        })

        this.lexer.rule(/[{}]/, (ctx, [match]) => {
            const types = {
                '{': 'OPEN',
                '}': 'CLOSE'
            }
            ctx.accept(`${types[match as ('{' | '}')]} block`)
        })

        this.lexer.rule(/[()]/, (ctx, [match]) => {
            const types = {
                '(': 'OPEN',
                ')': 'CLOSE'
            }
            ctx.accept(`${types[match as ('(' | ')')]} parenthesis`)
        })


        this.lexer.rule(/./, (ctx, _) => {
            ctx.accept("char")
        })
    }

    analyze(value: string, debug: boolean  = false){
        this.lexer.input(value);
        this.lexer.debug(debug);
        const lines: any = {};

        this.lexer.tokens().forEach((token: Token, pos: number) => {
            const {line} = token;
            lines[line] ||= [];
            lines[line].push(token);
        })

        Object.keys(lines).forEach((line) => {

            console.log(`LINE ${line} : `);

            (lines[line] as Token[]).forEach(({type, value, column}) => {
                console.log(` → Type: ${chalk.red(type)} , Value: ${chalk.magentaBright(value)} , Column: ${chalk.green(column)}`);
            })
            console.log(chalk.cyan('-----------------------------------------------------------------------------------------------'));
        })
    }
}