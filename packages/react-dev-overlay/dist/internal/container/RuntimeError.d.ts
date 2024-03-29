import * as React from 'react';
import type { ReadyRuntimeError } from '../helpers/getErrorByType';
export type RuntimeErrorProps = {
    error: ReadyRuntimeError;
};
declare const RuntimeError: React.FC<RuntimeErrorProps>;
export declare const styles: string;
export { RuntimeError };
