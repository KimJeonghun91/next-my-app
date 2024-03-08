"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
class ErrorBoundary extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, 
    // Loosely typed because it depends on the React version and was
    // accidentally excluded in some versions.
    errorInfo) {
        this.props.onError(error, errorInfo?.componentStack || null);
        if (!this.props.globalOverlay) {
            this.setState({ error });
        }
    }
    render() {
        // The component has to be unmounted or else it would continue to error
        return this.state.error ||
            (this.props.globalOverlay && this.props.isMounted) ? (
        // When the overlay is global for the application and it wraps a component rendering `<html>`
        // we have to render the html shell otherwise the shadow root will not be able to attach
        this.props.globalOverlay ? ((0, jsx_runtime_1.jsxs)("html", { children: [(0, jsx_runtime_1.jsx)("head", {}), (0, jsx_runtime_1.jsx)("body", {})] })) : null) : (this.props.children);
    }
}
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map