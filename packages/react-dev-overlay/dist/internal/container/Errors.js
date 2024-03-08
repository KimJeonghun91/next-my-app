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
exports.styles = exports.Errors = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const bus_1 = require("../bus");
const Dialog_1 = require("../components/Dialog");
const LeftRightDialogHeader_1 = require("../components/LeftRightDialogHeader");
const Overlay_1 = require("../components/Overlay");
const Toast_1 = require("../components/Toast");
const getErrorByType_1 = require("../helpers/getErrorByType");
const nodeStackFrames_1 = require("../helpers/nodeStackFrames");
const noop_template_1 = require("../helpers/noop-template");
const CloseIcon_1 = require("../icons/CloseIcon");
const RuntimeError_1 = require("./RuntimeError");
function getErrorSignature(ev) {
    const { event } = ev;
    switch (event.type) {
        case bus_1.TYPE_UNHANDLED_ERROR:
        case bus_1.TYPE_UNHANDLED_REJECTION: {
            return `${event.reason.name}::${event.reason.message}::${event.reason.stack}`;
        }
        default: {
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = event;
    return '';
}
const HotlinkedText = function HotlinkedText(props) {
    const { text } = props;
    const linkRegex = /https?:\/\/[^\s/$.?#].[^\s)'"]*/i;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: linkRegex.test(text)
            ? text.split(' ').map((word, index, array) => {
                if (linkRegex.test(word)) {
                    const link = linkRegex.exec(word);
                    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [link && ((0, jsx_runtime_1.jsx)("a", { href: link[0], target: "_blank", rel: "noreferrer noopener", children: word })), index === array.length - 1 ? '' : ' '] }, `link-${index}`));
                }
                return index === array.length - 1 ? ((0, jsx_runtime_1.jsx)(React.Fragment, { children: word }, `text-${index}`)) : ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [word, " "] }, `text-${index}`));
            })
            : text }));
};
const Errors = function Errors({ errors }) {
    const [lookups, setLookups] = React.useState({});
    const [readyErrors, nextError] = React.useMemo(() => {
        let ready = [];
        let next = null;
        // Ensure errors are displayed in the order they occurred in:
        for (let idx = 0; idx < errors.length; ++idx) {
            const e = errors[idx];
            const { id } = e;
            if (id in lookups) {
                ready.push(lookups[id]);
                continue;
            }
            // Check for duplicate errors
            if (idx > 0) {
                const prev = errors[idx - 1];
                if (getErrorSignature(prev) === getErrorSignature(e)) {
                    continue;
                }
            }
            next = e;
            break;
        }
        return [ready, next];
    }, [errors, lookups]);
    const isLoading = React.useMemo(() => {
        return readyErrors.length < 1 && Boolean(errors.length);
    }, [errors.length, readyErrors.length]);
    React.useEffect(() => {
        if (nextError == null) {
            return;
        }
        let mounted = true;
        (0, getErrorByType_1.getErrorByType)(nextError).then((resolved) => {
            // We don't care if the desired error changed while we were resolving,
            // thus we're not tracking it using a ref. Once the work has been done,
            // we'll store it.
            if (mounted) {
                setLookups((m) => ({ ...m, [resolved.id]: resolved }));
            }
        }, () => {
            // TODO: handle this, though an edge case
        });
        return () => {
            mounted = false;
        };
    }, [nextError]);
    const [displayState, setDisplayState] = React.useState('fullscreen');
    const [activeIdx, setActiveIndex] = React.useState(0);
    const previous = React.useCallback((e) => {
        e?.preventDefault();
        setActiveIndex((v) => Math.max(0, v - 1));
    }, []);
    const next = React.useCallback((e) => {
        e?.preventDefault();
        setActiveIndex((v) => Math.max(0, Math.min(readyErrors.length - 1, v + 1)));
    }, [readyErrors.length]);
    const activeError = React.useMemo(() => readyErrors[activeIdx] ?? null, [activeIdx, readyErrors]);
    // Reset component state when there are no errors to be displayed.
    // This should never happen, but lets handle it.
    React.useEffect(() => {
        if (errors.length < 1) {
            setLookups({});
            setDisplayState('hidden');
            setActiveIndex(0);
        }
    }, [errors.length]);
    const minimize = React.useCallback((e) => {
        e?.preventDefault();
        setDisplayState('minimized');
    }, []);
    const hide = React.useCallback((e) => {
        e?.preventDefault();
        setDisplayState('hidden');
    }, []);
    const fullscreen = React.useCallback((e) => {
        e?.preventDefault();
        setDisplayState('fullscreen');
    }, []);
    // This component shouldn't be rendered with no errors, but if it is, let's
    // handle it gracefully by rendering nothing.
    if (errors.length < 1 || activeError == null) {
        return null;
    }
    if (isLoading) {
        // TODO: better loading state
        return (0, jsx_runtime_1.jsx)(Overlay_1.Overlay, {});
    }
    if (displayState === 'hidden') {
        return null;
    }
    if (displayState === 'minimized') {
        return ((0, jsx_runtime_1.jsx)(Toast_1.Toast, { className: "nextjs-toast-errors-parent", onClick: fullscreen, children: (0, jsx_runtime_1.jsxs)("div", { className: "nextjs-toast-errors", children: [(0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "12", r: "10" }), (0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), (0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }), (0, jsx_runtime_1.jsxs)("span", { children: [readyErrors.length, " error", readyErrors.length > 1 ? 's' : ''] }), (0, jsx_runtime_1.jsx)("button", { "data-nextjs-toast-errors-hide-button": true, className: "nextjs-toast-errors-hide-button", type: "button", onClick: (e) => {
                            e.stopPropagation();
                            hide();
                        }, "aria-label": "Hide Errors", children: (0, jsx_runtime_1.jsx)(CloseIcon_1.CloseIcon, {}) })] }) }));
    }
    const isServerError = ['server', 'edge-server'].includes((0, nodeStackFrames_1.getErrorSource)(activeError.error) || '');
    return ((0, jsx_runtime_1.jsx)(Overlay_1.Overlay, { children: (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { type: "error", "aria-labelledby": "nextjs__container_errors_label", "aria-describedby": "nextjs__container_errors_desc", onClose: isServerError ? undefined : minimize, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { className: "nextjs-container-errors-header", children: [(0, jsx_runtime_1.jsx)(LeftRightDialogHeader_1.LeftRightDialogHeader, { previous: activeIdx > 0 ? previous : null, next: activeIdx < readyErrors.length - 1 ? next : null, close: isServerError ? undefined : minimize, children: (0, jsx_runtime_1.jsxs)("small", { children: [(0, jsx_runtime_1.jsx)("span", { children: activeIdx + 1 }), " of", ' ', (0, jsx_runtime_1.jsx)("span", { children: readyErrors.length }), " unhandled error", readyErrors.length < 2 ? '' : 's'] }) }), (0, jsx_runtime_1.jsx)("h1", { id: "nextjs__container_errors_label", children: isServerError ? 'Server Error' : 'Unhandled Runtime Error' }), (0, jsx_runtime_1.jsxs)("p", { id: "nextjs__container_errors_desc", children: [activeError.error.name, ":", ' ', (0, jsx_runtime_1.jsx)(HotlinkedText, { text: activeError.error.message })] }), isServerError ? ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("small", { children: "This error happened while generating the page. Any console logs will be displayed in the terminal window." }) })) : undefined] }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogBody, { className: "nextjs-container-errors-body", children: (0, jsx_runtime_1.jsx)(RuntimeError_1.RuntimeError, { error: activeError }, activeError.id.toString()) })] }) }) }));
};
exports.Errors = Errors;
exports.styles = (0, noop_template_1.noop) `
  .nextjs-container-errors-header > h1 {
    font-size: var(--size-font-big);
    line-height: var(--size-font-bigger);
    font-weight: bold;
    margin: 0;
    margin-top: calc(var(--size-gap-double) + var(--size-gap-half));
  }
  .nextjs-container-errors-header small {
    font-size: var(--size-font-small);
    color: var(--color-accents-1);
    margin-left: var(--size-gap-double);
  }
  .nextjs-container-errors-header small > span {
    font-family: var(--font-stack-monospace);
  }
  .nextjs-container-errors-header > p {
    font-family: var(--font-stack-monospace);
    font-size: var(--size-font-small);
    line-height: var(--size-font-big);
    font-weight: bold;
    margin: 0;
    margin-top: var(--size-gap-half);
    color: var(--color-ansi-red);
    white-space: pre-wrap;
  }
  .nextjs-container-errors-header > div > small {
    margin: 0;
    margin-top: var(--size-gap-half);
  }
  .nextjs-container-errors-header > p > a {
    color: var(--color-ansi-red);
  }

  .nextjs-container-errors-body > h2:not(:first-child) {
    margin-top: calc(var(--size-gap-double) + var(--size-gap));
  }
  .nextjs-container-errors-body > h2 {
    margin-bottom: var(--size-gap);
    font-size: var(--size-font-big);
  }

  .nextjs-toast-errors-parent {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .nextjs-toast-errors-parent:hover {
    transform: scale(1.1);
  }
  .nextjs-toast-errors {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .nextjs-toast-errors > svg {
    margin-right: var(--size-gap);
  }
  .nextjs-toast-errors-hide-button {
    margin-left: var(--size-gap-triple);
    border: none;
    background: none;
    color: var(--color-ansi-bright-white);
    padding: 0;
    transition: opacity 0.25s ease;
    opacity: 0.7;
  }
  .nextjs-toast-errors-hide-button:hover {
    opacity: 1;
  }
`;
//# sourceMappingURL=Errors.js.map