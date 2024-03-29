declare function register(): void;
declare function unregister(): void;
declare function onBuildOk(): void;
declare function onBuildError(message: string): void;
declare function onRefresh(): void;
declare function onBeforeRefresh(): void;
export { getErrorByType } from './internal/helpers/getErrorByType';
export { getServerError } from './internal/helpers/nodeStackFrames';
export { default as ReactDevOverlay } from './internal/ReactDevOverlay';
export { onBuildOk, onBuildError, register, unregister, onBeforeRefresh, onRefresh, };
