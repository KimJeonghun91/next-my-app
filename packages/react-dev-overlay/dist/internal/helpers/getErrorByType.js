"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorByType = void 0;
const bus_1 = require("../bus");
const nodeStackFrames_1 = require("./nodeStackFrames");
const stack_frame_1 = require("./stack-frame");
async function getErrorByType(ev) {
    const { id, event } = ev;
    switch (event.type) {
        case bus_1.TYPE_UNHANDLED_ERROR:
        case bus_1.TYPE_UNHANDLED_REJECTION: {
            const readyRuntimeError = {
                id,
                runtime: true,
                error: event.reason,
                frames: await (0, stack_frame_1.getOriginalStackFrames)(event.frames, (0, nodeStackFrames_1.getErrorSource)(event.reason), event.reason.toString()),
            };
            if (event.type === bus_1.TYPE_UNHANDLED_ERROR) {
                readyRuntimeError.componentStack = event.componentStack;
            }
            return readyRuntimeError;
        }
        default: {
            break;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = event;
    throw new Error('type system invariant violation');
}
exports.getErrorByType = getErrorByType;
//# sourceMappingURL=getErrorByType.js.map