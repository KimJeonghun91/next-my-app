import * as React from 'react';
type ErrorType = 'runtime' | 'build';
type ReactDevOverlayProps = {
    children?: React.ReactNode;
    preventDisplay?: ErrorType[];
    globalOverlay?: boolean;
};
declare const ReactDevOverlay: React.FunctionComponent<ReactDevOverlayProps>;
export default ReactDevOverlay;
