import {HtmlPlMockRuntime} from "./runtimes/mock-runtime";
import {HtmlPlInterpreter} from "./interpreter";
import parse from "node-html-parser";

describe("Example programs tests", function () {
    it('should calculate the sum of natural numbers', async function () {
        const mockRuntime = new HtmlPlMockRuntime();
        const interpreter = new HtmlPlInterpreter({
            runtime: mockRuntime
        });
        const cstNode = parse(`
        <!-- Sum of the first N numbers -->
        <var name="sum">0</var>
        <var name="n"><input/></var>
        
        <form value="n">
          <!-- Increment the sum by n -->
          <var name="sum">
            <math>
              <var name="sum" />
              +
              <var name="n" />
            </math>
          </var>
        
          <!-- Decrement n by 1 -->
          <var name="n">
            <math>
              <var name="n" />
              - 1
            </math>
          </var>
        </form>
          
        <output>
          <var name="sum" />
        </output>
        `);

        mockRuntime.valuesToRead.push("10");
        await interpreter.executeProgram(cstNode);

        expect(mockRuntime.valuesPrinted).toEqual([55])
    });
})
