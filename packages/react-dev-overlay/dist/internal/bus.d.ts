import type { StackFrame } from 'stacktrace-parser';
export declare const TYPE_BUILD_OK = "build-ok";
export declare const TYPE_BUILD_ERROR = "build-error";
export declare const TYPE_REFRESH = "fast-refresh";
export declare const TYPE_BEFORE_REFRESH = "before-fast-refresh";
export declare const TYPE_UNHANDLED_ERROR = "unhandled-error";
export declare const TYPE_UNHANDLED_REJECTION = "unhandled-rejection";
export type BuildOk = {
    type: typeof TYPE_BUILD_OK;
};
export type BuildError = {
    type: typeof TYPE_BUILD_ERROR;
    message: string;
};
export type BeforeFastRefresh = {
    type: typeof TYPE_BEFORE_REFRESH;
};
export type FastRefresh = {
    type: typeof TYPE_REFRESH;
};
export type UnhandledError = {
    type: typeof TYPE_UNHANDLED_ERROR;
    reason: Error;
    frames: StackFrame[];
    componentStack?: string[];
};
export type UnhandledRejection = {
    type: typeof TYPE_UNHANDLED_REJECTION;
    reason: Error;
    frames: StackFrame[];
};
export type BusEvent = BuildOk | BuildError | FastRefresh | BeforeFastRefresh | UnhandledError | UnhandledRejection;
export type BusEventHandler = (ev: BusEvent) => void;
export declare function emit(ev: BusEvent): void;
export declare function on(fn: BusEventHandler): boolean;
export declare function off(fn: BusEventHandler): boolean;
