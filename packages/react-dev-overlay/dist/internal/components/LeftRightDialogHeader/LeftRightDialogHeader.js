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
exports.LeftRightDialogHeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const CloseIcon_1 = require("../../icons/CloseIcon");
const LeftRightDialogHeader = function LeftRightDialogHeader({ children, className, previous, next, close, }) {
    const buttonLeft = React.useRef(null);
    const buttonRight = React.useRef(null);
    const buttonClose = React.useRef(null);
    const [nav, setNav] = React.useState(null);
    const onNav = React.useCallback((el) => {
        setNav(el);
    }, []);
    React.useEffect(() => {
        if (nav == null) {
            return;
        }
        const root = nav.getRootNode();
        const d = self.document;
        function handler(e) {
            if (e.key === 'ArrowLeft') {
                e.stopPropagation();
                if (buttonLeft.current) {
                    buttonLeft.current.focus();
                }
                previous && previous();
            }
            else if (e.key === 'ArrowRight') {
                e.stopPropagation();
                if (buttonRight.current) {
                    buttonRight.current.focus();
                }
                next && next();
            }
            else if (e.key === 'Escape') {
                e.stopPropagation();
                if (root instanceof ShadowRoot) {
                    const a = root.activeElement;
                    if (a && a !== buttonClose.current && a instanceof HTMLElement) {
                        a.blur();
                        return;
                    }
                }
                if (close) {
                    close();
                }
            }
        }
        root.addEventListener('keydown', handler);
        if (root !== d) {
            d.addEventListener('keydown', handler);
        }
        return function () {
            root.removeEventListener('keydown', handler);
            if (root !== d) {
                d.removeEventListener('keydown', handler);
            }
        };
    }, [close, nav, next, previous]);
    // Unlock focus for browsers like Firefox, that break all user focus if the
    // currently focused item becomes disabled.
    React.useEffect(() => {
        if (nav == null) {
            return;
        }
        const root = nav.getRootNode();
        // Always true, but we do this for TypeScript:
        if (root instanceof ShadowRoot) {
            const a = root.activeElement;
            if (previous == null) {
                if (buttonLeft.current && a === buttonLeft.current) {
                    buttonLeft.current.blur();
                }
            }
            else if (next == null) {
                if (buttonRight.current && a === buttonRight.current) {
                    buttonRight.current.blur();
                }
            }
        }
    }, [nav, next, previous]);
    return ((0, jsx_runtime_1.jsxs)("div", { "data-nextjs-dialog-left-right": true, className: className, children: [(0, jsx_runtime_1.jsxs)("nav", { ref: onNav, children: [(0, jsx_runtime_1.jsx)("button", { ref: buttonLeft, type: "button", disabled: previous == null ? true : undefined, "aria-disabled": previous == null ? true : undefined, onClick: previous ?? undefined, children: (0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [(0, jsx_runtime_1.jsx)("title", { children: "previous" }), (0, jsx_runtime_1.jsx)("path", { d: "M6.99996 1.16666L1.16663 6.99999L6.99996 12.8333M12.8333 6.99999H1.99996H12.8333Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), (0, jsx_runtime_1.jsx)("button", { ref: buttonRight, type: "button", disabled: next == null ? true : undefined, "aria-disabled": next == null ? true : undefined, onClick: next ?? undefined, children: (0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [(0, jsx_runtime_1.jsx)("title", { children: "next" }), (0, jsx_runtime_1.jsx)("path", { d: "M6.99996 1.16666L12.8333 6.99999L6.99996 12.8333M1.16663 6.99999H12H1.16663Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), "\u00A0", children] }), close ? ((0, jsx_runtime_1.jsx)("button", { "data-nextjs-errors-dialog-left-right-close-button": true, ref: buttonClose, type: "button", onClick: close, "aria-label": "Close", children: (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(CloseIcon_1.CloseIcon, {}) }) })) : null] }));
};
exports.LeftRightDialogHeader = LeftRightDialogHeader;
//# sourceMappingURL=LeftRightDialogHeader.js.map