"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createErrorHandler", {
    enumerable: true,
    get: function() {
        return createErrorHandler;
    }
});
const _stringhash = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/string-hash"));
const _formatservererror = require("../../lib/format-server-error");
const _tracer = require("../lib/trace/tracer");
const _pipereadable = require("../pipe-readable");
const _isdynamicusageerror = require("../../export/helpers/is-dynamic-usage-error");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createErrorHandler({ /**
   * Used for debugging
   */ _source, dev, isNextExport, errorLogger, capturedErrors, allCapturedErrors, silenceLogger }) {
    return (err)=>{
        var _err_message;
        if (allCapturedErrors) allCapturedErrors.push(err);
        // These errors are expected. We return the digest
        // so that they can be properly handled.
        if ((0, _isdynamicusageerror.isDynamicUsageError)(err)) return err.digest;
        // If the response was closed, we don't need to log the error.
        if ((0, _pipereadable.isAbortError)(err)) return;
        // Format server errors in development to add more helpful error messages
        if (dev) {
            (0, _formatservererror.formatServerError)(err);
        }
        // Used for debugging error source
        // console.error(_source, err)
        // Don't log the suppressed error during export
        if (!(isNextExport && (err == null ? void 0 : (_err_message = err.message) == null ? void 0 : _err_message.includes("The specific message is omitted in production builds to avoid leaking sensitive details.")))) {
            // Record exception in an active span, if available.
            const span = (0, _tracer.getTracer)().getActiveScopeSpan();
            if (span) {
                span.recordException(err);
                span.setStatus({
                    code: _tracer.SpanStatusCode.ERROR,
                    message: err.message
                });
            }
            if (!silenceLogger) {
                if (errorLogger) {
                    errorLogger(err).catch(()=>{});
                } else {
                    // The error logger is currently not provided in the edge runtime.
                    // Use `log-app-dir-error` instead.
                    // It won't log the source code, but the error will be more useful.
                    if (process.env.NODE_ENV !== "production") {
                        const { logAppDirError } = require("../dev/log-app-dir-error");
                        logAppDirError(err);
                    } else {
                        console.error(err);
                    }
                }
            }
        }
        capturedErrors.push(err);
        // TODO-APP: look at using webcrypto instead. Requires a promise to be awaited.
        return (0, _stringhash.default)(err.message + err.stack + (err.digest || "")).toString();
    };
}

//# sourceMappingURL=create-error-handler.js.map