"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceMapUrl = void 0;
function getSourceMapUrl(fileContents) {
    const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
    let match = null;
    for (;;) {
        let next = regex.exec(fileContents);
        if (next == null) {
            break;
        }
        match = next;
    }
    if (!(match && match[1])) {
        return null;
    }
    return match[1].toString();
}
exports.getSourceMapUrl = getSourceMapUrl;
//# sourceMappingURL=getSourceMapUrl.js.map