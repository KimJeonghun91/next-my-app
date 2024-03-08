"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Toast = function Toast({ onClick, children, className, }) {
    return ((0, jsx_runtime_1.jsx)("div", { "data-nextjs-toast": true, onClick: onClick, className: className, children: (0, jsx_runtime_1.jsx)("div", { "data-nextjs-toast-wrapper": true, children: children }) }));
};
exports.Toast = Toast;
//# sourceMappingURL=Toast.js.map