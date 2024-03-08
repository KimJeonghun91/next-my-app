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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const Bus = __importStar(require("./bus"));
const ShadowPortal_1 = require("./components/ShadowPortal");
const BuildError_1 = require("./container/BuildError");
const Errors_1 = require("./container/Errors");
const ErrorBoundary_1 = require("./ErrorBoundary");
const Base_1 = require("./styles/Base");
const ComponentStyles_1 = require("./styles/ComponentStyles");
const CssReset_1 = require("./styles/CssReset");
function pushErrorFilterDuplicates(errors, err) {
    return [
        ...errors.filter((e) => {
            // Filter out duplicate errors
            return e.event.reason !== err.event.reason;
        }),
        err,
    ];
}
function reducer(state, ev) {
    switch (ev.type) {
        case Bus.TYPE_BUILD_OK: {
            return { ...state, buildError: null };
        }
        case Bus.TYPE_BUILD_ERROR: {
            return { ...state, buildError: ev.message };
        }
        case Bus.TYPE_BEFORE_REFRESH: {
            return { ...state, refreshState: { type: 'pending', errors: [] } };
        }
        case Bus.TYPE_REFRESH: {
            return {
                ...state,
                buildError: null,
                errors: 
                // Errors can come in during updates. In this case, UNHANDLED_ERROR
                // and UNHANDLED_REJECTION events might be dispatched between the
                // BEFORE_REFRESH and the REFRESH event. We want to keep those errors
                // around until the next refresh. Otherwise we run into a race
                // condition where those errors would be cleared on refresh completion
                // before they can be displayed.
                state.refreshState.type === 'pending'
                    ? state.refreshState.errors
                    : [],
                refreshState: { type: 'idle' },
            };
        }
        case Bus.TYPE_UNHANDLED_ERROR:
        case Bus.TYPE_UNHANDLED_REJECTION: {
            switch (state.refreshState.type) {
                case 'idle': {
                    return {
                        ...state,
                        nextId: state.nextId + 1,
                        errors: pushErrorFilterDuplicates(state.errors, {
                            id: state.nextId,
                            event: ev,
                        }),
                    };
                }
                case 'pending': {
                    return {
                        ...state,
                        nextId: state.nextId + 1,
                        refreshState: {
                            ...state.refreshState,
                            errors: pushErrorFilterDuplicates(state.refreshState.errors, {
                                id: state.nextId,
                                event: ev,
                            }),
                        },
                    };
                }
                default:
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const _ = state.refreshState;
                    return state;
            }
        }
        default: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _ = ev;
            return state;
        }
    }
}
const shouldPreventDisplay = (errorType, preventType) => {
    if (!preventType || !errorType) {
        return false;
    }
    return preventType.includes(errorType);
};
const ReactDevOverlay = function ReactDevOverlay({ children, preventDisplay, globalOverlay }) {
    const [state, dispatch] = React.useReducer(reducer, {
        nextId: 1,
        buildError: null,
        errors: [],
        refreshState: {
            type: 'idle',
        },
    });
    React.useEffect(() => {
        Bus.on(dispatch);
        return function () {
            Bus.off(dispatch);
        };
    }, [dispatch]);
    const onComponentError = React.useCallback((_error, _componentStack) => {
        // TODO: special handling
    }, []);
    const hasBuildError = state.buildError != null;
    const hasRuntimeErrors = Boolean(state.errors.length);
    const errorType = hasBuildError
        ? 'build'
        : hasRuntimeErrors
            ? 'runtime'
            : null;
    const isMounted = errorType !== null;
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { globalOverlay: globalOverlay, isMounted: isMounted, onError: onComponentError, children: children ?? null }), isMounted ? ((0, jsx_runtime_1.jsxs)(ShadowPortal_1.ShadowPortal, { globalOverlay: globalOverlay, children: [(0, jsx_runtime_1.jsx)(CssReset_1.CssReset, {}), (0, jsx_runtime_1.jsx)(Base_1.Base, {}), (0, jsx_runtime_1.jsx)(ComponentStyles_1.ComponentStyles, {}), shouldPreventDisplay(errorType, preventDisplay) ? null : hasBuildError ? ((0, jsx_runtime_1.jsx)(BuildError_1.BuildError, { message: state.buildError })) : hasRuntimeErrors ? ((0, jsx_runtime_1.jsx)(Errors_1.Errors, { errors: state.errors })) : undefined] })) : undefined] }));
};
exports.default = ReactDevOverlay;
//# sourceMappingURL=ReactDevOverlay.js.map