import * as React from 'react';
import type { StackFrame } from 'stacktrace-parser';
export type CodeFrameProps = {
    stackFrame: StackFrame;
    codeFrame: string;
};
export declare const CodeFrame: React.FC<CodeFrameProps>;
