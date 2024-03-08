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
exports.Terminal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const anser_1 = __importDefault(require("anser"));
const React = __importStar(require("react"));
const Terminal = function Terminal({ content, }) {
    const decoded = React.useMemo(() => {
        return anser_1.default.ansiToJson(content, {
            json: true,
            use_classes: true,
            remove_empty: true,
        });
    }, [content]);
    return ((0, jsx_runtime_1.jsx)("div", { "data-nextjs-terminal": true, children: (0, jsx_runtime_1.jsx)("pre", { children: decoded.map((entry, index) => ((0, jsx_runtime_1.jsx)("span", { style: {
                    color: entry.fg ? `var(--color-${entry.fg})` : undefined,
                    ...(entry.decoration === 'bold'
                        ? { fontWeight: 800 }
                        : entry.decoration === 'italic'
                            ? { fontStyle: 'italic' }
                            : undefined),
                }, children: entry.content }, `terminal-entry-${index}`))) }) }));
};
exports.Terminal = Terminal;
//# sourceMappingURL=Terminal.js.map