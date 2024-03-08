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
exports.onRefresh = exports.onBeforeRefresh = exports.unregister = exports.register = exports.onBuildError = exports.onBuildOk = exports.ReactDevOverlay = exports.getServerError = exports.getErrorByType = void 0;
const Bus = __importStar(require("./internal/bus"));
const parseStack_1 = require("./internal/helpers/parseStack");
const parse_component_stack_1 = require("next/dist/client/components/react-dev-overlay/internal/helpers/parse-component-stack");
const hydration_error_info_1 = require("next/dist/client/components/react-dev-overlay/internal/helpers/hydration-error-info");
// Patch console.error to collect information about hydration errors
(0, hydration_error_info_1.patchConsoleError)();
let isRegistered = false;
let stackTraceLimit = undefined;
function onUnhandledError(ev) {
    const error = ev?.error;
    if (!error || !(error instanceof Error) || typeof error.stack !== 'string') {
        // A non-error was thrown, we don't have anything to show. :-(
        return;
    }
    if (error.message.match(/(hydration|content does not match|did not match)/i)) {
        if (hydration_error_info_1.hydrationErrorWarning) {
            // The patched console.error found hydration errors logged by React
            // Append the logged warning to the error message
            error.message += '\n\n' + hydration_error_info_1.hydrationErrorWarning;
        }
        error.message += `\n\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error`;
    }
    const e = error;
    const componentStack = typeof hydration_error_info_1.hydrationErrorComponentStack === 'string'
        ? (0, parse_component_stack_1.parseComponentStack)(hydration_error_info_1.hydrationErrorComponentStack).map((frame) => frame.component)
        : undefined;
    Bus.emit({
        type: Bus.TYPE_UNHANDLED_ERROR,
        reason: error,
        frames: (0, parseStack_1.parseStack)(e.stack),
        componentStack,
    });
}
function onUnhandledRejection(ev) {
    const reason = ev?.reason;
    if (!reason ||
        !(reason instanceof Error) ||
        typeof reason.stack !== 'string') {
        // A non-error was thrown, we don't have anything to show. :-(
        return;
    }
    const e = reason;
    Bus.emit({
        type: Bus.TYPE_UNHANDLED_REJECTION,
        reason: reason,
        frames: (0, parseStack_1.parseStack)(e.stack),
    });
}
function register() {
    if (isRegistered) {
        return;
    }
    isRegistered = true;
    try {
        const limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 50;
        stackTraceLimit = limit;
    }
    catch { }
    window.addEventListener('error', onUnhandledError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
}
exports.register = register;
function unregister() {
    if (!isRegistered) {
        return;
    }
    isRegistered = false;
    if (stackTraceLimit !== undefined) {
        try {
            Error.stackTraceLimit = stackTraceLimit;
        }
        catch { }
        stackTraceLimit = undefined;
    }
    window.removeEventListener('error', onUnhandledError);
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
}
exports.unregister = unregister;
function onBuildOk() {
    Bus.emit({ type: Bus.TYPE_BUILD_OK });
}
exports.onBuildOk = onBuildOk;
function onBuildError(message) {
    Bus.emit({ type: Bus.TYPE_BUILD_ERROR, message });
}
exports.onBuildError = onBuildError;
function onRefresh() {
    Bus.emit({ type: Bus.TYPE_REFRESH });
}
exports.onRefresh = onRefresh;
function onBeforeRefresh() {
    Bus.emit({ type: Bus.TYPE_BEFORE_REFRESH });
}
exports.onBeforeRefresh = onBeforeRefresh;
var getErrorByType_1 = require("./internal/helpers/getErrorByType");
Object.defineProperty(exports, "getErrorByType", { enumerable: true, get: function () { return getErrorByType_1.getErrorByType; } });
var nodeStackFrames_1 = require("./internal/helpers/nodeStackFrames");
Object.defineProperty(exports, "getServerError", { enumerable: true, get: function () { return nodeStackFrames_1.getServerError; } });
var ReactDevOverlay_1 = require("./internal/ReactDevOverlay");
Object.defineProperty(exports, "ReactDevOverlay", { enumerable: true, get: function () { return __importDefault(ReactDevOverlay_1).default; } });
//# sourceMappingURL=client.js.map