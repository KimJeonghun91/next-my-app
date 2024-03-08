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
exports.Dialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const use_on_click_outside_1 = require("../../hooks/use-on-click-outside");
const Dialog = function Dialog({ children, type, onClose, ...props }) {
    const [dialog, setDialog] = React.useState(null);
    const [role, setRole] = React.useState(typeof document !== 'undefined' && document.hasFocus()
        ? 'dialog'
        : undefined);
    const onDialog = React.useCallback((node) => {
        setDialog(node);
    }, []);
    (0, use_on_click_outside_1.useOnClickOutside)(dialog, onClose);
    // Make HTMLElements with `role=link` accessible to be triggered by the
    // keyboard, i.e. [Enter].
    React.useEffect(() => {
        if (dialog == null) {
            return;
        }
        const root = dialog.getRootNode();
        // Always true, but we do this for TypeScript:
        if (!(root instanceof ShadowRoot)) {
            return;
        }
        const shadowRoot = root;
        function handler(e) {
            const el = shadowRoot.activeElement;
            if (e.key === 'Enter' &&
                el instanceof HTMLElement &&
                el.getAttribute('role') === 'link') {
                e.preventDefault();
                e.stopPropagation();
                el.click();
            }
        }
        function handleFocus() {
            // safari will force itself as the active application when a background page triggers any sort of autofocus
            // this is a workaround to only set the dialog role if the document has focus
            setRole(document.hasFocus() ? 'dialog' : undefined);
        }
        shadowRoot.addEventListener('keydown', handler);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleFocus);
        return () => {
            shadowRoot.removeEventListener('keydown', handler);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleFocus);
        };
    }, [dialog]);
    return ((0, jsx_runtime_1.jsxs)("div", { ref: onDialog, "data-nextjs-dialog": true, tabIndex: -1, role: role, "aria-labelledby": props['aria-labelledby'], "aria-describedby": props['aria-describedby'], "aria-modal": "true", children: [(0, jsx_runtime_1.jsx)("div", { "data-nextjs-dialog-banner": true, className: `banner-${type}` }), children] }));
};
exports.Dialog = Dialog;
//# sourceMappingURL=Dialog.js.map