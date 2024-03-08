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
exports.Overlay = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// @ts-ignore
const maintain__tab_focus_1 = __importDefault(require("./maintain--tab-focus"));
const React = __importStar(require("react"));
const body_locker_1 = require("./body-locker");
const Overlay = function Overlay({ className, children, fixed, }) {
    React.useEffect(() => {
        (0, body_locker_1.lock)();
        return () => {
            (0, body_locker_1.unlock)();
        };
    }, []);
    const [overlay, setOverlay] = React.useState(null);
    const onOverlay = React.useCallback((el) => {
        setOverlay(el);
    }, []);
    React.useEffect(() => {
        if (overlay == null) {
            return;
        }
        const handle2 = (0, maintain__tab_focus_1.default)({ context: overlay });
        return () => {
            handle2.disengage();
        };
    }, [overlay]);
    return ((0, jsx_runtime_1.jsxs)("div", { "data-nextjs-dialog-overlay": true, className: className, ref: onOverlay, children: [(0, jsx_runtime_1.jsx)("div", { "data-nextjs-dialog-backdrop": true, "data-nextjs-dialog-backdrop-fixed": fixed ? true : undefined }), children] }));
};
exports.Overlay = Overlay;
//# sourceMappingURL=Overlay.js.map