import {HtmlPlInterpreter} from "./interpreter";
import parse from "node-html-parser";

describe('HtmlPl interpreter', function () {
    it('should evaluate a simple html expression', function () {
        const interpreter = new HtmlPlInterpreter();
        const cstNode = parse(`
           <var name="myVariable">
               <ul>
                    <li>1</li>
                    <li>2</li>
                </ul>
           </var> 
        `);
        interpreter.executeProgram(cstNode);

        expect(interpreter.currentEnvironment.get("myVariable")).toEqual(["1", "2"])
    });
});
