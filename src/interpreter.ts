import {HTMLElement, Node, NodeType} from "node-html-parser";
import {HtmlPlRuntime} from "./runtimes/runtime";

enum HtmlPlNodeType {
    PROGRAM_ROOT = null,
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var
    STMT_VAR = "VAR", // variable declaration
    EXPR_OL = "OL", // array declaration
    EXPR_UL = "UL", // array declaration
    EXPR_LI = "LI", // for declaring array elements
    EXPR_INPUT   = "INPUT", // stdin
    STMT_OUTPUT = "OUTPUT", // stdout
    // conditional logic
    EXPR_SELECT = "SELECT",
    EXPR_OPTION = "OPTION",
    EXPR_TIME = "TIME",
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element/math
    EXPR_MATH = "MATH",
    // For m loop
    STMT_FORM = "FORM",
}

/**
 * HtmlPl supports only "global" environment (scope) for now.
 */
class HtmlPlEnvironment {
    private lookup: Map<string, unknown>;

    constructor() {
        this.lookup = new Map()
    }

    set(name: string, value: unknown) {
        this.lookup.set(name, value);
    }

    get(name: string): unknown {
        return this.lookup.get(name)
    }
}

export type HtmlPlInterpreterOptions = {
    runtime: HtmlPlRuntime;
}

export class HtmlPlInterpreter {

    public currentEnvironment: HtmlPlEnvironment;
    public runtime: HtmlPlRuntime;

    constructor(options: HtmlPlInterpreterOptions) {
        this.currentEnvironment = new HtmlPlEnvironment();
        this.runtime = options.runtime;
    }

    // HtmlPl program is a list of statements.
    // Execute accepts a root node with child nodes that represent statements.
    // Text nodes with empty (trimmed) value are skipped for now.
    public async executeProgram(htmlNode: HTMLElement) {
        // @ts-ignore tag name comparison with enum
        if (htmlNode.tagName !== HtmlPlNodeType.PROGRAM_ROOT) {
            throw new Error(`Expected root html node, found: ${htmlNode.tagName}`);
        }
        for (const child of this.filterNodes(htmlNode.childNodes)) {
            await this.executeStatement(child as HTMLElement)
        }
    }

    public async executeStatement(htmlNode: HTMLElement) {
        switch (htmlNode.tagName) {
            case HtmlPlNodeType.STMT_VAR:
                return this.executeVarStmt(htmlNode);
            case HtmlPlNodeType.STMT_OUTPUT:
                return this.executeOutputStmt(htmlNode);
            case HtmlPlNodeType.STMT_FORM:
                return this.executeFormStmt(htmlNode);
            default:
                throw new Error(`Invalid HTML element: ${htmlNode.tagName}`)
        }
    }

    private async executeFormStmt(node: HTMLElement) {
        const conditionVariableName = node.attributes["value"];
        while (!this.isEqual(this.currentEnvironment.get(conditionVariableName), "0")) {
            const childStatements = this.filterNodes(node.childNodes);
            for (const child of childStatements) {
                await this.executeStatement(child as HTMLElement)
            }
        }
    }

    private async executeOutputStmt(node: HTMLElement) {
        const targetVariableName = node.attributes["value"];
        const targetValue = this.currentEnvironment.get(targetVariableName);
        this.runtime.print(targetValue);
    }

    private async executeVarStmt(node: HTMLElement) {
        const {attributes} = node;
        const childNodes = this.filterNodes(node.childNodes);
        const name = attributes["name"];
        if (childNodes.length === 0) {
            throw new Error(`Expected value child in <var>`)
        }
        if (childNodes.length > 1) {
            throw new Error(`Expected a single value child in <var>`)
        }
        const value = await this.evaluateExpression(childNodes[0] as HTMLElement);
        this.currentEnvironment.set(name, value);
    }

    private async evaluateExpression(node: Node): Promise<unknown> {
        if (node.nodeType === NodeType.TEXT_NODE) {
            return node.text;
        }
        const nonTextNode = node as HTMLElement;
        switch (nonTextNode.tagName) {
            case HtmlPlNodeType.EXPR_OL:
            case HtmlPlNodeType.EXPR_UL:
                return this.evaluateListExpression(nonTextNode);
            case HtmlPlNodeType.EXPR_SELECT:
                return this.evaluateSelectExpression(nonTextNode);
            case HtmlPlNodeType.EXPR_INPUT:
                return this.evaluateInputExpr(nonTextNode);
            case HtmlPlNodeType.EXPR_MATH:
                return this.evaluateMathExpr(nonTextNode);
            default:
                throw new Error(`Unknown expression node: ${nonTextNode.tagName}`)
        }
    }

    private evaluateMathExpr(node: HTMLElement): Promise<unknown> {
        return eval(node.text);
    }

    private async evaluateInputExpr(node: HTMLElement): Promise<unknown> {
        return this.runtime.prompt();
    }

    private async evaluateListExpression(node: HTMLElement): Promise<unknown> {
        const listElementNodes = this.filterNodes(node.childNodes)
            .filter(node => (node as HTMLElement).tagName === HtmlPlNodeType.EXPR_LI);
        return listElementNodes.map(node => node.text);
    }

    private async evaluateSelectExpression(node: HTMLElement): Promise<unknown> {
        const childNodes = this.filterNodes(node.childNodes);
        const targetVariableName = node.attributes["value"];
        const targetValue = this.currentEnvironment.get(targetVariableName);
        const cases = childNodes.filter(node => (node as HTMLElement).tagName === HtmlPlNodeType.EXPR_OPTION);
        const matchedCase = cases.find(comparisonCase => this.isEqual((comparisonCase as HTMLElement).attributes["value"], targetValue))
        if (!matchedCase) {
            return null;
        }
        const matchedCaseChildren = matchedCase.childNodes;
        if (matchedCaseChildren.length !== 1) {
            throw new Error("Expected OPTION to have a single child node.")
        }
        return this.evaluateExpression(matchedCaseChildren[0]);
    }

    private isEqual(value1: unknown, value2: unknown) {
        // Non-strict comparison is intentional here,
        // as we want to be more permissive.
        return value1 == value2;
    }

    private filterNodes(nodes: Node[]) {
        return nodes.filter(child => {
            const isEmptyTextNode = child.nodeType === NodeType.TEXT_NODE && child.text.trim() === "";
            const isComment = child.nodeType === NodeType.COMMENT_NODE;
            return !isEmptyTextNode && !isComment;
        })
    }


}
