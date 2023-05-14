import {HtmlPlRuntime} from "./runtime";

/**
 * This runtime works on top of OS platform.
 */
export class HtmlPlNativeRuntime implements HtmlPlRuntime {

    print(output: unknown): void {
        console.log(output);
    }

    prompt(): Promise<string> {
        return new Promise<string>(resolve => {
            let result = ""
            process.stdin.on("data", data => {
                const input = data.toString();

                if (input === "\n") {
                    return resolve(result);
                }

                result += input;
            });
        });
    }

}
