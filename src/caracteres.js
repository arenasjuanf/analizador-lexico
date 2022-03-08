"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizr_1 = __importDefault(require("tokenizr"));
const chalk_1 = __importDefault(require("chalk")); // console colors libry
class Analyzer {
    constructor() {
        this.lexer = new tokenizr_1.default();
        this.initLexer();
        this.lexer.error("********************************");
    }
    initLexer() {
        //Function
        this.lexer.rule(/(fun [a-zA-Z])\w+\(.*\)/, (ctx, [match]) => {
            const functName = match.split('(')[0].replace('fun ', "");
            let [params] = match.match(/\(([^()]*)\)/);
            params = params.replace('(', '').replace(')', '').split(',');
            ctx.accept("Function", `${functName}`);
            params.forEach((param) => {
                ctx.accept(`Argument ${functName}`, `${param.trim()}`);
            });
        });
        //Id
        this.lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
            ctx.accept("Id");
        });
        //Number
        this.lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
            ctx.accept("Number", parseInt(match[0]));
        });
        //String
        this.lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
            ctx.accept("String", match[1].replace(/\\"/g, "\""));
        });
        //Comment 1 line
        this.lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, [match]) => {
            ctx.accept("Comment", match.replace('//', ""));
        });
        //Blanks
        this.lexer.rule(/[ \t\r\n]+/, (ctx, _) => {
            ctx.ignore(); // ignore spaces
        });
        //Blocks
        this.lexer.rule(/[{}]/, (ctx, [match]) => {
            const types = {
                '{': 'Open',
                '}': 'Close'
            };
            ctx.accept(`${types[match]} block`);
        });
        // Parenthesis
        this.lexer.rule(/[()]/, (ctx, x) => {
            const match = x[0];
            const types = {
                '(': 'Open',
                ')': 'Close'
            };
            ctx.accept(`${types[match]} parenthesis`);
        });
        //Character
        this.lexer.rule(/( ?[-+*\/=])/, (ctx, [match]) => {
            const characters = {
                '=': 'Equal',
                '+': 'Add',
                '-': 'Minus',
                '*': 'Multiply',
                '/': 'Divide'
            };
            //
            ctx.accept(`Character`, characters[match]);
        });
    }
    analyze(value, debug = false) {
        try {
            this.lexer.input(value);
            this.lexer.debug(debug);
            const lines = {};
            this.lexer.tokens().forEach((token, pos) => {
                const { line } = token;
                lines[line] || (lines[line] = []);
                lines[line].push(token);
            });
            Object.keys(lines).forEach((line) => {
                console.log(chalk_1.default.greenBright(`LINE ${line} : `));
                lines[line].forEach(({ type, value, column }) => {
                    console.log(` → Type: ${chalk_1.default.red(type)} , Value: ${chalk_1.default.magentaBright(value)} , Column: ${chalk_1.default.green(column)}`);
                });
                console.log(chalk_1.default.cyan('-----------------------------------------------------------------'));
            });
        }
        catch ({ pos, line, column }) {
            console.log(chalk_1.default.red(JSON.stringify({ msg: 'token not recognized', pos, line, column })));
        }
    }
}
exports.default = Analyzer;
