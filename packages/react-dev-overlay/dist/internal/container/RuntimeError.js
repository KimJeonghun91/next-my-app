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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = exports.styles = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const CodeFrame_1 = require("../components/CodeFrame");
const noop_template_1 = require("../helpers/noop-template");
const stack_frame_1 = require("../helpers/stack-frame");
const CallStackFrame = function CallStackFrame({ frame }) {
    // TODO: ability to expand resolved frames
    // TODO: render error or external indicator
    const f = frame.originalStackFrame ?? frame.sourceStackFrame;
    const hasSource = Boolean(frame.originalCodeFrame);
    const open = React.useCallback(() => {
        if (!hasSource)
            return;
        const params = new URLSearchParams();
        for (const key in f) {
            params.append(key, (f[key] ?? '').toString());
        }
        self
            .fetch(`${process.env.__NEXT_ROUTER_BASEPATH || ''}/__nextjs_launch-editor?${params.toString()}`)
            .then(() => { }, () => {
            console.error('There was an issue opening this code in your editor.');
        });
    }, [hasSource, f]);
    return ((0, jsx_runtime_1.jsxs)("div", { "data-nextjs-call-stack-frame": true, children: [(0, jsx_runtime_1.jsx)("h3", { "data-nextjs-frame-expanded": Boolean(frame.expanded), children: f.methodName }), (0, jsx_runtime_1.jsxs)("div", { "data-has-source": hasSource ? 'true' : undefined, tabIndex: hasSource ? 10 : undefined, role: hasSource ? 'link' : undefined, onClick: open, title: hasSource ? 'Click to open in your editor' : undefined, children: [(0, jsx_runtime_1.jsx)("span", { children: (0, stack_frame_1.getFrameSource)(f) }), (0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), (0, jsx_runtime_1.jsx)("polyline", { points: "15 3 21 3 21 9" }), (0, jsx_runtime_1.jsx)("line", { x1: "10", y1: "14", x2: "21", y2: "3" })] })] })] }));
};
const RuntimeError = function RuntimeError({ error, }) {
    const firstFirstPartyFrameIndex = React.useMemo(() => {
        return error.frames.findIndex((entry) => entry.expanded &&
            Boolean(entry.originalCodeFrame) &&
            Boolean(entry.originalStackFrame));
    }, [error.frames]);
    const firstFrame = React.useMemo(() => {
        return error.frames[firstFirstPartyFrameIndex] ?? null;
    }, [error.frames, firstFirstPartyFrameIndex]);
    const allLeadingFrames = React.useMemo(() => firstFirstPartyFrameIndex < 0
        ? []
        : error.frames.slice(0, firstFirstPartyFrameIndex), [error.frames, firstFirstPartyFrameIndex]);
    const [all, setAll] = React.useState(firstFrame == null);
    const toggleAll = React.useCallback(() => {
        setAll((v) => !v);
    }, []);
    const leadingFrames = React.useMemo(() => allLeadingFrames.filter((f) => f.expanded || all), [all, allLeadingFrames]);
    const allCallStackFrames = React.useMemo(() => error.frames.slice(firstFirstPartyFrameIndex + 1), [error.frames, firstFirstPartyFrameIndex]);
    const visibleCallStackFrames = React.useMemo(() => allCallStackFrames.filter((f) => f.expanded || all), [all, allCallStackFrames]);
    const canShowMore = React.useMemo(() => {
        return (allCallStackFrames.length !== visibleCallStackFrames.length ||
            (all && firstFrame != null));
    }, [
        all,
        allCallStackFrames.length,
        firstFrame,
        visibleCallStackFrames.length,
    ]);
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [firstFrame ? ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Source" }), leadingFrames.map((frame, index) => ((0, jsx_runtime_1.jsx)(CallStackFrame, { frame: frame }, `leading-frame-${index}-${all}`))), (0, jsx_runtime_1.jsx)(CodeFrame_1.CodeFrame, { stackFrame: firstFrame.originalStackFrame, codeFrame: firstFrame.originalCodeFrame })] })) : undefined, error.componentStack ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Component Stack" }), error.componentStack.map((component, index) => ((0, jsx_runtime_1.jsx)("div", { "data-nextjs-component-stack-frame": true, children: (0, jsx_runtime_1.jsx)("h3", { children: component }) }, index)))] })) : null, visibleCallStackFrames.length ? ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Call Stack" }), visibleCallStackFrames.map((frame, index) => ((0, jsx_runtime_1.jsx)(CallStackFrame, { frame: frame }, `call-stack-${index}-${all}`)))] })) : undefined, canShowMore ? ((0, jsx_runtime_1.jsx)(React.Fragment, { children: (0, jsx_runtime_1.jsxs)("button", { tabIndex: 10, "data-nextjs-data-runtime-error-collapsed-action": true, type: "button", onClick: toggleAll, children: [all ? 'Hide' : 'Show', " collapsed frames"] }) })) : undefined] }));
};
exports.RuntimeError = RuntimeError;
exports.styles = (0, noop_template_1.noop) `
  button[data-nextjs-data-runtime-error-collapsed-action] {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--size-font-small);
    line-height: var(--size-font-bigger);
    color: var(--color-accents-3);
  }

  [data-nextjs-call-stack-frame]:not(:last-child),
  [data-nextjs-component-stack-frame]:not(:last-child) {
    margin-bottom: var(--size-gap-double);
  }

  [data-nextjs-call-stack-frame] > h3,
  [data-nextjs-component-stack-frame] > h3 {
    margin-top: 0;
    margin-bottom: var(--size-gap);
    font-family: var(--font-stack-monospace);
    color: var(--color-stack-h6);
  }
  [data-nextjs-call-stack-frame] > h3[data-nextjs-frame-expanded='false'] {
    color: var(--color-stack-headline);
  }
  [data-nextjs-call-stack-frame] > div {
    display: flex;
    align-items: center;
    padding-left: calc(var(--size-gap) + var(--size-gap-half));
    font-size: var(--size-font-small);
    color: var(--color-stack-subline);
  }
  [data-nextjs-call-stack-frame] > div > svg {
    width: auto;
    height: var(--size-font-small);
    margin-left: var(--size-gap);

    display: none;
  }

  [data-nextjs-call-stack-frame] > div[data-has-source] {
    cursor: pointer;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source]:hover {
    text-decoration: underline dotted;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source] > svg {
    display: unset;
  }
`;
//# sourceMappingURL=RuntimeError.js.map