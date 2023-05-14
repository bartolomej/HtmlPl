import {HtmlPlRuntime} from "./runtime";

export class HtmlPlMockRuntime implements HtmlPlRuntime {
    public valuesPrinted = [];
    public valuesToRead = [];

    print(output: unknown): void {
        this.valuesPrinted.push(output);
    }

    async prompt(): Promise<string> {
        return this.valuesToRead.pop();
    }

}
