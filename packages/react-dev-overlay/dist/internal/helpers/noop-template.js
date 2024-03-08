"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = void 0;
function noop(strings, ...keys) {
    const lastIndex = strings.length - 1;
    return (strings.slice(0, lastIndex).reduce((p, s, i) => p + s + keys[i], '') +
        strings[lastIndex]);
}
exports.noop = noop;
//# sourceMappingURL=noop-template.js.map