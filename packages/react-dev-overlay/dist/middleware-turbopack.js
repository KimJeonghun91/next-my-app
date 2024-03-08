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
exports.getOverlayMiddleware = exports.createOriginalStackFrame = void 0;
const promises_1 = __importStar(require("fs/promises"));
const url_1 = __importDefault(require("url"));
const code_frame_1 = require("@babel/code-frame");
const launchEditor_1 = require("./internal/helpers/launchEditor");
const currentSourcesByFile = new Map();
async function batchedTraceSource(project, frame) {
    const file = frame.file ? decodeURIComponent(frame.file) : undefined;
    if (!file) {
        return;
    }
    const sourceFrame = await project.traceSource(frame);
    if (!sourceFrame) {
        return;
    }
    let source;
    // Don't show code frames for node_modules. These can also often be large bundled files.
    if (!sourceFrame.file.includes('node_modules')) {
        let sourcePromise = currentSourcesByFile.get(sourceFrame.file);
        if (!sourcePromise) {
            sourcePromise = project.getSourceForAsset(sourceFrame.file);
            currentSourcesByFile.set(sourceFrame.file, sourcePromise);
            setTimeout(() => {
                // Cache file reads for 100ms, as frames will often reference the same
                // files and can be large.
                currentSourcesByFile.delete(sourceFrame.file);
            }, 100);
        }
        source = await sourcePromise;
    }
    return {
        frame: {
            file: sourceFrame.file,
            lineNumber: sourceFrame.line,
            column: sourceFrame.column,
            methodName: sourceFrame.methodName ?? frame.methodName ?? '<unknown>',
            arguments: [],
        },
        source: source ?? null,
    };
}
async function createOriginalStackFrame(project, frame) {
    const traced = await batchedTraceSource(project, frame);
    if (!traced) {
        return null;
    }
    return {
        originalStackFrame: traced.frame,
        originalCodeFrame: traced.source === null || traced.frame.file.includes('node_modules')
            ? null
            : (0, code_frame_1.codeFrameColumns)(traced.source, {
                start: {
                    line: traced.frame.lineNumber,
                    column: traced.frame.column ?? 0,
                },
            }, { forceColor: true }),
    };
}
exports.createOriginalStackFrame = createOriginalStackFrame;
function stackFrameFromQuery(query) {
    return {
        file: query.file,
        methodName: query.methodName,
        line: typeof query.lineNumber === 'string' ? parseInt(query.lineNumber, 10) : 0,
        column: typeof query.column === 'string' ? parseInt(query.column, 10) : null,
        isServer: query.isServer === 'true',
    };
}
function getOverlayMiddleware(project) {
    return async function (req, res) {
        const { pathname, query } = url_1.default.parse(req.url, true);
        if (pathname === '/__nextjs_original-stack-frame') {
            const frame = stackFrameFromQuery(query);
            let originalStackFrame;
            try {
                originalStackFrame = await createOriginalStackFrame(project, frame);
            }
            catch (e) {
                res.statusCode = 500;
                res.write(e.message);
                res.end();
                return;
            }
            if (originalStackFrame === null) {
                res.statusCode = 404;
                res.write('Unable to resolve sourcemap');
                res.end();
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.write(Buffer.from(JSON.stringify(originalStackFrame)));
            res.end();
            return;
        }
        else if (pathname === '/__nextjs_launch-editor') {
            const frame = stackFrameFromQuery(query);
            const filePath = frame.file?.toString();
            if (filePath === undefined) {
                res.statusCode = 400;
                res.write('Bad Request');
                res.end();
                return;
            }
            const fileExists = await promises_1.default.access(filePath, promises_1.constants.F_OK).then(() => true, () => false);
            if (!fileExists) {
                res.statusCode = 204;
                res.write('No Content');
                res.end();
                return;
            }
            try {
                (0, launchEditor_1.launchEditor)(filePath, frame.line, frame.column ?? 1);
            }
            catch (err) {
                console.log('Failed to launch editor:', err);
                res.statusCode = 500;
                res.write('Internal Server Error');
                res.end();
                return;
            }
            res.statusCode = 204;
            res.end();
        }
    };
}
exports.getOverlayMiddleware = getOverlayMiddleware;
//# sourceMappingURL=middleware-turbopack.js.map