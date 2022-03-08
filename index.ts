import fs from "fs"
import Analyzer from "./src/caracteres";

let text:string = fs.readFileSync("text.txt", "utf8");

const analyzer: Analyzer = new Analyzer();

analyzer.analyze(text || '');
