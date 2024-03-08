import React from 'react';
type ErrorBoundaryProps = {
    children?: React.ReactNode;
    onError: (error: Error, componentStack: string | null) => void;
    globalOverlay?: boolean;
    isMounted?: boolean;
};
type ErrorBoundaryState = {
    error: Error | null;
};
declare class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
    state: {
        error: null;
    };
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    componentDidCatch(error: Error, errorInfo?: {
        componentStack?: string | null;
    }): void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export { ErrorBoundary };
