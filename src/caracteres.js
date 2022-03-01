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
    }
    initLexer() {
        this.lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
            ctx.accept("id");
        });
        this.lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
            ctx.accept("number", parseInt(match[0]));
        });
        this.lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
            ctx.accept("string", match[1].replace(/\\"/g, "\""));
        });
        this.lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, [match]) => {
            ctx.accept("comment", match.replace('//', ""));
        });
        this.lexer.rule(/[ \t\r\n]+/, (ctx, _) => {
            ctx.ignore(); // ignore spaces
        });
        this.lexer.rule(/[{}]/, (ctx, [match]) => {
            const types = {
                '{': 'OPEN',
                '}': 'CLOSE'
            };
            ctx.accept(`${types[match]} block`);
        });
        this.lexer.rule(/[()]/, (ctx, [match]) => {
            const types = {
                '(': 'OPEN',
                ')': 'CLOSE'
            };
            ctx.accept(`${types[match]} parenthesis`);
        });
        this.lexer.rule(/./, (ctx, _) => {
            ctx.accept("char");
        });
    }
    analyze(value, debug = false) {
        this.lexer.input(value);
        this.lexer.debug(debug);
        const lines = {};
        this.lexer.tokens().forEach((token, pos) => {
            const { line } = token;
            lines[line] || (lines[line] = []);
            lines[line].push(token);
        });
        Object.keys(lines).forEach((line) => {
            console.log(`LINE ${line} : `);
            lines[line].forEach(({ type, value, column }) => {
                console.log(` → Type: ${chalk_1.default.red(type)} , Value: ${chalk_1.default.magentaBright(value)} , Column: ${chalk_1.default.green(column)}`);
            });
            console.log(chalk_1.default.cyan('-----------------------------------------------------------------------------------------------'));
        });
    }
}
exports.default = Analyzer;
