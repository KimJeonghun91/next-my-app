"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = void 0;
const noop_template_1 = require("../../helpers/noop-template");
const styles = (0, noop_template_1.noop) `
  [data-nextjs-dialog-overlay] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 9000;

    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10vh 15px 0;
  }

  @media (max-height: 812px) {
    [data-nextjs-dialog-overlay] {
      padding: 15px 15px 0;
    }
  }

  [data-nextjs-dialog-backdrop] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--color-backdrop);
    pointer-events: all;
    z-index: -1;
  }

  [data-nextjs-dialog-backdrop-fixed] {
    cursor: not-allowed;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
`;
exports.styles = styles;
//# sourceMappingURL=styles.js.map