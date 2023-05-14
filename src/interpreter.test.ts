import {HtmlPlInterpreter} from "./interpreter";
import parse from "node-html-parser";
import {HtmlPlMockRuntime} from "./runtimes/mock-runtime";
import mock = jest.mock;


describe('HtmlPl interpreter', function () {
    it('should evaluate a simple html expression', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
           <var name="myVariable">
               <ul>
                    <li>1</li>
                    <li>2</li>
                </ul>
           </var> 
        `);
        await interpreter.executeProgram(cstNode);

        expect(interpreter.currentEnvironment.get("myVariable")).toEqual(["1", "2"])
    });

    it('should evaluate a simple switch expression', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
           <var name="myVariable">1</var> 
           <var name="myCalculatedVariable">
                <select value="myVariable">
                    <option value="0">It's false</option>
                    <option value="1">It's true</option>
                </select>
            </var>
        `);
        await interpreter.executeProgram(cstNode);

        expect(interpreter.currentEnvironment.get("myVariable")).toEqual("1")
        expect(interpreter.currentEnvironment.get("myCalculatedVariable")).toEqual("It's true")
    });

    it('should evaluate a simple output statement', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
           <output value="myVariable">1</output>
        `);

        await interpreter.executeProgram(cstNode);

        expect(mockRuntime.valuesPrinted).toEqual(["1"]);
    });

    it('should evaluate a simple input statement', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
           <var name="myVariable"><input /></var>
        `);

        mockRuntime.valuesToRead.push("Hello World")
        await interpreter.executeProgram(cstNode);

        expect(interpreter.currentEnvironment.get("myVariable")).toEqual("Hello World")
    });


    it('should evaluate a simple loop statement', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
           <var name="myVariable">1</var>
           <form value="myVariable">
                <output>
                    <var name="myVariable" />
                </output>
                <var name="myVariable">0</var>
           </form>
        `);

        await interpreter.executeProgram(cstNode);

        expect(mockRuntime.valuesPrinted).toEqual(["1"])
    });

    it('should evaluate a simple math expression', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
           <var name="myVariable">
                <math>1 + 2</math>
           </var>
        `);

        await interpreter.executeProgram(cstNode);

        expect(interpreter.currentEnvironment.get("myVariable")).toEqual(3)
    });

    it('should evaluate 3 iterations of a loop', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
           <var name="myVariable">3</var>
           <form value="myVariable">
                <output>
                    <var name="myVariable" /> 
                </output>
                <var name="myVariable">
                    <math>
                        <var name="myVariable" />
                        - 1
                    </math>
                </var>
           </form>
        `);

        await interpreter.executeProgram(cstNode);

        expect(mockRuntime.valuesPrinted).toEqual(["3", 2, 1])
        expect(interpreter.currentEnvironment.get("myVariable")).toEqual(0)
    });
});
