import * as React from 'react';
import type { UnhandledError, UnhandledRejection } from '../bus';
export type SupportedErrorEvent = {
    id: number;
    event: UnhandledError | UnhandledRejection;
};
export type ErrorsProps = {
    errors: SupportedErrorEvent[];
};
export declare const Errors: React.FC<ErrorsProps>;
export declare const styles: string;
