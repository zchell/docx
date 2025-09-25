/// <reference types="react" />

declare module 'react/jsx-runtime' {
  export default any;
}

declare module 'react/jsx-dev-runtime' {
  export default any;
}

declare global {
  namespace React {
    const StrictMode: React.ComponentType<{ children?: React.ReactNode }>;
    const useState: <T>(initialState: T | (() => T)) => [T, React.Dispatch<React.SetStateAction<T>>];
  }
}

export {};