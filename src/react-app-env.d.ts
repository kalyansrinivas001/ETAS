// Minimal JSX and asset declarations to keep editor/TS happy before deps are installed.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare module '*.mp3'
