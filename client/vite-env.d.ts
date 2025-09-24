/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface Window {
  React: any;
  ReactDOM: any;
}