import {HtmlPlTarget} from "./target";
import {HtmlPlInterpreter} from "../interpreter";
import {HtmlPlWebRuntime} from "../runtimes/web-runtime";
import parse from "node-html-parser";

export class HtmlPlWeb implements HtmlPlTarget {
    private interpreter: HtmlPlInterpreter;

    constructor() {
        this.interpreter = new HtmlPlInterpreter({
            runtime: new HtmlPlWebRuntime()
        })
    }

    async run(programSource: string): Promise<void> {
        const cst = parse(programSource);
        await this.interpreter.executeProgram(cst);
    }
}

// For now just manually export the class so that it's available in index.html.
// @ts-ignore
window.HtmlPlWeb = HtmlPlWeb;
