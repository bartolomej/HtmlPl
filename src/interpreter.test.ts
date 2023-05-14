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

    it('should evaluate a simple switch expression', function () {
        const interpreter = new HtmlPlInterpreter();
        const cstNode = parse(`
           <var name="myVariable">1</var> 
           <var name="myCalculatedVariable">
                <select value="myVariable">
                    <option value="0">It's false</option>
                    <option value="1">It's true</option>
                </select>
            </var>
        `);
        interpreter.executeProgram(cstNode);

        expect(interpreter.currentEnvironment.get("myVariable")).toEqual("1")
        expect(interpreter.currentEnvironment.get("myCalculatedVariable")).toEqual("It's true")
    });
});
