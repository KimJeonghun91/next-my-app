"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentStyles = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const styles_1 = require("../components/CodeFrame/styles");
const Dialog_1 = require("../components/Dialog");
const styles_2 = require("../components/LeftRightDialogHeader/styles");
const styles_3 = require("../components/Overlay/styles");
const styles_4 = require("../components/Terminal/styles");
const Toast_1 = require("../components/Toast");
const BuildError_1 = require("../container/BuildError");
const Errors_1 = require("../container/Errors");
const RuntimeError_1 = require("../container/RuntimeError");
const noop_template_1 = require("../helpers/noop-template");
function ComponentStyles() {
    return ((0, jsx_runtime_1.jsx)("style", { children: (0, noop_template_1.noop) `
        ${styles_3.styles}
        ${Toast_1.styles}
        ${Dialog_1.styles}
        ${styles_2.styles}
        ${styles_1.styles}
        ${styles_4.styles}
        
        ${BuildError_1.styles}
        ${Errors_1.styles}
        ${RuntimeError_1.styles}
      ` }));
}
exports.ComponentStyles = ComponentStyles;
//# sourceMappingURL=ComponentStyles.js.map