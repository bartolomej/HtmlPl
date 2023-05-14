export interface HtmlPlRuntime {
    prompt: () => Promise<string>;
    print: (output: unknown) => void;
}
