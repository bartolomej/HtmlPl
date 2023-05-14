import {HtmlPlRuntime} from "./runtime";

export class HtmlPlWebRuntime implements HtmlPlRuntime {
    print(output: unknown): void {
        alert(output);
    }

    async prompt(): Promise<string> {
        return prompt("") ?? ""
    }

}
