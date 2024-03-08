import type { IncomingMessage, ServerResponse } from 'http';
import type { OriginalStackFrameResponse } from './middleware';
interface Project {
    getSourceForAsset(filePath: string): Promise<string | null>;
    traceSource(stackFrame: TurbopackStackFrame): Promise<TurbopackStackFrame | null>;
}
interface TurbopackStackFrame {
    column: number | null;
    file: string;
    isServer: boolean;
    line: number;
    methodName: string | null;
}
export declare function createOriginalStackFrame(project: Project, frame: TurbopackStackFrame): Promise<OriginalStackFrameResponse | null>;
export declare function getOverlayMiddleware(project: Project): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export {};
