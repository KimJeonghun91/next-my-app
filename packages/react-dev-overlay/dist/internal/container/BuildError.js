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
exports.styles = exports.BuildError = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const Dialog_1 = require("../components/Dialog");
const Overlay_1 = require("../components/Overlay");
const Terminal_1 = require("../components/Terminal");
const noop_template_1 = require("../helpers/noop-template");
const BuildError = function BuildError({ message, }) {
    const noop = React.useCallback(() => { }, []);
    return ((0, jsx_runtime_1.jsx)(Overlay_1.Overlay, { fixed: true, children: (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { type: "error", "aria-labelledby": "nextjs__container_build_error_label", "aria-describedby": "nextjs__container_build_error_desc", onClose: noop, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { className: "nextjs-container-build-error-header", children: (0, jsx_runtime_1.jsx)("h4", { id: "nextjs__container_build_error_label", children: "Failed to compile" }) }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogBody, { className: "nextjs-container-build-error-body", children: [(0, jsx_runtime_1.jsx)(Terminal_1.Terminal, { content: message }), (0, jsx_runtime_1.jsx)("footer", { children: (0, jsx_runtime_1.jsx)("p", { id: "nextjs__container_build_error_desc", children: (0, jsx_runtime_1.jsx)("small", { children: "This error occurred during the build process and can only be dismissed by fixing the error." }) }) })] })] }) }) }));
};
exports.BuildError = BuildError;
exports.styles = (0, noop_template_1.noop) `
  .nextjs-container-build-error-header > h4 {
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .nextjs-container-build-error-body footer {
    margin-top: var(--size-gap);
  }
  .nextjs-container-build-error-body footer p {
    margin: 0;
  }

  .nextjs-container-build-error-body small {
    color: var(--color-font);
  }
`;
//# sourceMappingURL=BuildError.js.map