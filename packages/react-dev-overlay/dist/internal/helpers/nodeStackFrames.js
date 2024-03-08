"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerError = exports.decorateServerError = exports.getErrorSource = exports.getFilesystemFrame = void 0;
const stacktrace_parser_1 = require("stacktrace-parser");
function getFilesystemFrame(frame) {
    const f = { ...frame };
    if (typeof f.file === 'string') {
        if (
        // Posix:
        f.file.startsWith('/') ||
            // Win32:
            /^[a-z]:\\/i.test(f.file) ||
            // Win32 UNC:
            f.file.startsWith('\\\\')) {
            f.file = `file://${f.file}`;
        }
    }
    return f;
}
exports.getFilesystemFrame = getFilesystemFrame;
const symbolError = Symbol('NextjsError');
function getErrorSource(error) {
    return error[symbolError] || null;
}
exports.getErrorSource = getErrorSource;
function decorateServerError(error, type) {
    Object.defineProperty(error, symbolError, {
        writable: false,
        enumerable: false,
        configurable: false,
        value: type,
    });
}
exports.decorateServerError = decorateServerError;
function getServerError(error, type) {
    let n;
    try {
        throw new Error(error.message);
    }
    catch (e) {
        n = e;
    }
    n.name = error.name;
    try {
        n.stack = `${n.toString()}\n${(0, stacktrace_parser_1.parse)(error.stack)
            .map(getFilesystemFrame)
            .map((f) => {
            let str = `    at ${f.methodName}`;
            if (f.file) {
                let loc = f.file;
                if (f.lineNumber) {
                    loc += `:${f.lineNumber}`;
                    if (f.column) {
                        loc += `:${f.column}`;
                    }
                }
                str += ` (${loc})`;
            }
            return str;
        })
            .join('\n')}`;
    }
    catch {
        n.stack = error.stack;
    }
    decorateServerError(n, type);
    return n;
}
exports.getServerError = getServerError;
//# sourceMappingURL=nodeStackFrames.js.map