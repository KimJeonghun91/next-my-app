"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.off = exports.on = exports.emit = exports.TYPE_UNHANDLED_REJECTION = exports.TYPE_UNHANDLED_ERROR = exports.TYPE_BEFORE_REFRESH = exports.TYPE_REFRESH = exports.TYPE_BUILD_ERROR = exports.TYPE_BUILD_OK = void 0;
exports.TYPE_BUILD_OK = 'build-ok';
exports.TYPE_BUILD_ERROR = 'build-error';
exports.TYPE_REFRESH = 'fast-refresh';
exports.TYPE_BEFORE_REFRESH = 'before-fast-refresh';
exports.TYPE_UNHANDLED_ERROR = 'unhandled-error';
exports.TYPE_UNHANDLED_REJECTION = 'unhandled-rejection';
let handlers = new Set();
let queue = [];
function drain() {
    // Draining should never happen synchronously in case multiple handlers are
    // registered.
    setTimeout(function () {
        while (
        // Until we are out of events:
        Boolean(queue.length) &&
            // Or, if all handlers removed themselves as a result of handling the
            // event(s)
            Boolean(handlers.size)) {
            const ev = queue.shift();
            handlers.forEach((handler) => handler(ev));
        }
    }, 1);
}
function emit(ev) {
    queue.push(Object.freeze({ ...ev }));
    drain();
}
exports.emit = emit;
function on(fn) {
    if (handlers.has(fn)) {
        return false;
    }
    handlers.add(fn);
    drain();
    return true;
}
exports.on = on;
function off(fn) {
    if (handlers.has(fn)) {
        handlers.delete(fn);
        return true;
    }
    return false;
}
exports.off = off;
//# sourceMappingURL=bus.js.map