"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRawSourceMap = void 0;
const data_uri_to_buffer_1 = __importDefault(require("data-uri-to-buffer"));
const getSourceMapUrl_1 = require("./getSourceMapUrl");
function getRawSourceMap(fileContents) {
    const sourceUrl = (0, getSourceMapUrl_1.getSourceMapUrl)(fileContents);
    if (!sourceUrl?.startsWith('data:')) {
        return null;
    }
    let buffer;
    try {
        buffer = (0, data_uri_to_buffer_1.default)(sourceUrl);
    }
    catch (err) {
        console.error('Failed to parse source map URL:', err);
        return null;
    }
    if (buffer.type !== 'application/json') {
        console.error(`Unknown source map type: ${buffer.typeFull}.`);
        return null;
    }
    try {
        return JSON.parse(buffer.toString());
    }
    catch {
        console.error('Failed to parse source map.');
        return null;
    }
}
exports.getRawSourceMap = getRawSourceMap;
//# sourceMappingURL=getRawSourceMap.js.map