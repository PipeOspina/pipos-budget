/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXAMPLE_KEY;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
