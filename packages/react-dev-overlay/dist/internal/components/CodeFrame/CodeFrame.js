"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeFrame = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const anser_1 = __importDefault(require("anser"));
const React = __importStar(require("react"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const stack_frame_1 = require("../../helpers/stack-frame");
const CodeFrame = function CodeFrame({ stackFrame, codeFrame, }) {
    // Strip leading spaces out of the code frame:
    const formattedFrame = React.useMemo(() => {
        const lines = codeFrame.split(/\r?\n/g);
        const prefixLength = lines
            .map((line) => /^>? +\d+ +\| [ ]+/.exec((0, strip_ansi_1.default)(line)) === null
            ? null
            : /^>? +\d+ +\| ( *)/.exec((0, strip_ansi_1.default)(line)))
            .filter(Boolean)
            .map((v) => v.pop())
            .reduce((c, n) => (isNaN(c) ? n.length : Math.min(c, n.length)), NaN);
        if (prefixLength > 1) {
            const p = ' '.repeat(prefixLength);
            return lines
                .map((line, a) => ~(a = line.indexOf('|'))
                ? line.substring(0, a) + line.substring(a).replace(p, '')
                : line)
                .join('\n');
        }
        return lines.join('\n');
    }, [codeFrame]);
    const decoded = React.useMemo(() => {
        return anser_1.default.ansiToJson(formattedFrame, {
            json: true,
            use_classes: true,
            remove_empty: true,
        });
    }, [formattedFrame]);
    const open = React.useCallback(() => {
        const params = new URLSearchParams();
        for (const key in stackFrame) {
            params.append(key, (stackFrame[key] ?? '').toString());
        }
        self
            .fetch(`${process.env.__NEXT_ROUTER_BASEPATH || ''}/__nextjs_launch-editor?${params.toString()}`)
            .then(() => { }, () => {
            console.error('There was an issue opening this code in your editor.');
        });
    }, [stackFrame]);
    // TODO: make the caret absolute
    return ((0, jsx_runtime_1.jsxs)("div", { "data-nextjs-codeframe": true, children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { role: "link", onClick: open, tabIndex: 1, title: "Click to open in your editor", children: [(0, jsx_runtime_1.jsxs)("span", { children: [(0, stack_frame_1.getFrameSource)(stackFrame), " @ ", stackFrame.methodName] }), (0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), (0, jsx_runtime_1.jsx)("polyline", { points: "15 3 21 3 21 9" }), (0, jsx_runtime_1.jsx)("line", { x1: "10", y1: "14", x2: "21", y2: "3" })] })] }) }), (0, jsx_runtime_1.jsx)("pre", { children: decoded.map((entry, index) => ((0, jsx_runtime_1.jsx)("span", { style: {
                        color: entry.fg ? `var(--color-${entry.fg})` : undefined,
                        ...(entry.decoration === 'bold'
                            ? { fontWeight: 800 }
                            : entry.decoration === 'italic'
                                ? { fontStyle: 'italic' }
                                : undefined),
                    }, children: entry.content }, `frame-${index}`))) })] }));
};
exports.CodeFrame = CodeFrame;
//# sourceMappingURL=CodeFrame.js.map