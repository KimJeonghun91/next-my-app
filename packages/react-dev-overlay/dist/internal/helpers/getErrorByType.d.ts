import type { SupportedErrorEvent } from '../container/Errors';
import type { OriginalStackFrame } from './stack-frame';
export type ReadyRuntimeError = {
    id: number;
    runtime: true;
    error: Error;
    frames: OriginalStackFrame[];
    componentStack?: string[];
};
export declare function getErrorByType(ev: SupportedErrorEvent): Promise<ReadyRuntimeError>;
