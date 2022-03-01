"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const caracteres_1 = __importDefault(require("./src/caracteres"));
let text = fs_1.default.readFileSync("text.txt", "utf8");
const analyzer = new caracteres_1.default();
analyzer.analyze(text || '');
