import {HTMLElement, Node, NodeType} from "node-html-parser";

enum HtmlPlNodeType {
    PROGRAM_ROOT = null,
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var
    STMT_VAR = "VAR", // variable declaration
    OL = "OL", // array declaration
    UL = "UL", // array declaration
    LI = "LI", // for declaring array elements
    INPUT = "INPUT", // for reading from stdin
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data
    DATA = "DATA",
    // conditional logic
    SELECT = "SELECT",
    OPTION = "OPTION",
    TIME = "TIME",
    // https://developer.mozilla.org/en-US/docs/Web/MathML/Element/math
    MATH = "MATH"
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

export class HtmlPlInterpreter {

    public currentEnvironment: HtmlPlEnvironment;

    constructor() {
        this.currentEnvironment = new HtmlPlEnvironment()
    }

    // HtmlPl program is a list of statements.
    // Execute accepts a root node with child nodes that represent statements.
    // Text nodes with empty (trimmed) value are skipped for now.
    public executeProgram(htmlNode: HTMLElement) {
        // @ts-ignore tag name comparison with enum
        if (htmlNode.tagName !== HtmlPlNodeType.PROGRAM_ROOT) {
            throw new Error(`Expected root html node, found: ${htmlNode.tagName}`);
        }
        this.filterNodes(htmlNode.childNodes)
            .map(child => this.executeStatement(child as HTMLElement))
    }

    public executeStatement(htmlNode: HTMLElement) {
        switch (htmlNode.tagName) {
            case HtmlPlNodeType.STMT_VAR:
                return this.executeVarStmt(htmlNode);
            default:
                throw new Error(`Invalid HTML element: ${htmlNode.tagName}`)
        }
    }

    private executeVarStmt(node: HTMLElement) {
        const {attributes} = node;
        const childNodes = this.filterNodes(node.childNodes);
        const name = attributes["name"];
        if (childNodes.length === 0) {
            throw new Error(`Expected value child in <var>`)
        }
        if (childNodes.length > 1) {
            throw new Error(`Expected a single value child in <var>`)
        }
        const value = this.evaluateExpression(childNodes[0] as HTMLElement);
        this.currentEnvironment.set(name, value);
    }

    private evaluateExpression(node: HTMLElement): unknown {
        switch (node.tagName) {
            case HtmlPlNodeType.OL:
            case HtmlPlNodeType.UL:
                return this.evaluateListExpression(node);
            default:
                throw new Error(`Unknown expression node: ${node.tagName}`)
        }
    }

    private evaluateListExpression(node: HTMLElement): unknown {
        const listElementNodes = this.filterNodes(node.childNodes)
            .filter(node => (node as HTMLElement).tagName === HtmlPlNodeType.LI);
        return listElementNodes.map(node => node.text);
    }

    private filterNodes(nodes: Node[]) {
        return nodes.filter(child => {
            const isEmptyTextNode = child.nodeType === NodeType.TEXT_NODE && child.text.trim() === "";
            const isComment = child.nodeType === NodeType.COMMENT_NODE;
            return !isEmptyTextNode && !isComment;
        })
    }


}
