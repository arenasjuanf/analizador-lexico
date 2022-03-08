import Tokenizr, { Token } from "tokenizr";
import chalk from 'chalk'; // console colors libry

export default class Analyzer{
    lexer: Tokenizr = new Tokenizr();


    constructor(){
        this.initLexer();
        this.lexer.error("********************************");
    }

    initLexer(){

        //Function
        this.lexer.rule(/(fun [a-zA-Z])\w+\(.*\)/, (ctx, [match]) => {
            const functName = match.split('(')[0].replace('fun ',"");
            let [params]= match.match(/\(([^()]*)\)/) as any [];
            params = params.replace('(','').replace(')','').split(',');
            ctx.accept("Function", `${functName}`);
            params.forEach((param: string) => {
                ctx.accept(`Argument ${functName}`, `${param.trim()}`);
            });
        });

        //Id
        this.lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
            ctx.accept("Id")
        });

        //Number
        this.lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
            ctx.accept("Number", parseInt(match[0]))
        });

        //String
        this.lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
            ctx.accept("String", match[1].replace(/\\"/g, "\""))
        })

        //Comment 1 line
        this.lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, [match]) => {
            ctx.accept("Comment", match.replace('//', ""))
        })

        //Blanks
        this.lexer.rule(/[ \t\r\n]+/, (ctx, _) => {
            ctx.ignore() // ignore spaces
        })

        //Blocks
        this.lexer.rule(/[{}]/, (ctx, [match]) => {
            const types = {
                '{': 'Open',
                '}': 'Close'
            }
            ctx.accept(`${types[match as ('{' | '}')]} block`)
        })

        // Parenthesis
        this.lexer.rule(/[()]/, (ctx, x) => {
            const match = x[0];
            const types = {
                '(': 'Open',
                ')': 'Close'
            }
            ctx.accept(`${types[match as ('(' | ')')]} parenthesis`)
        })

        //Character
        this.lexer.rule(/( ?[-+*\/=])/, (ctx, [match]) => {
            const characters = {
                '=': 'Equal',
                '+': 'Add',
                '-': 'Minus',
                '*': 'Multiply',
                '/': 'Divide'
            }

            //
            ctx.accept(`Character`, characters[match as ('='| '+' | '-' | '*' | '/') ]);
        })

    }

    analyze(value: string, debug: boolean  = false){
        try{
            this.lexer.input(value);
            this.lexer.debug(debug);

            const lines: any = {};
            
            this.lexer.tokens().forEach((token: Token, pos: number) => {
                const {line} = token;
                lines[line] ||= [];
                lines[line].push(token);
            })

    
            Object.keys(lines).forEach((line) => {
                console.log(chalk.greenBright(`LINE ${line} : `));
                (lines[line] as Token[]).forEach(({type, value, column}) => {
                    console.log(` → Type: ${chalk.red(type)} , Value: ${chalk.magentaBright(value)} , Column: ${chalk.green(column)}`);
                })
                console.log(chalk.cyan('-----------------------------------------------------------------'));
            })
        }catch({pos, line, column}){
            console.log(chalk.red(JSON.stringify({msg: 'token not recognized', pos, line, column})));
        }
    }
}