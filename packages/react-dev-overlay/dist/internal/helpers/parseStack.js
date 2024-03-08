"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStack = void 0;
const stacktrace_parser_1 = require("stacktrace-parser");
const regexNextStatic = /\/_next(\/static\/.+)/;
function parseStack(stack) {
    const frames = (0, stacktrace_parser_1.parse)(stack);
    return frames.map((frame) => {
        try {
            const url = new URL(frame.file);
            const res = regexNextStatic.exec(url.pathname);
            if (res) {
                const distDir = process.env.__NEXT_DIST_DIR
                    ?.replace(/\\/g, '/')
                    ?.replace(/\/$/, '');
                if (distDir) {
                    frame.file = 'file://' + distDir.concat(res.pop());
                }
            }
        }
        catch { }
        return frame;
    });
}
exports.parseStack = parseStack;
//# sourceMappingURL=parseStack.js.map