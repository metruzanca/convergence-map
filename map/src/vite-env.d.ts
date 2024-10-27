/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_MAIN_URL: string;
  readonly VITE_MAP_SCADU_URL: string;
  readonly VITE_MAP_SOFIA_URL: string;
  readonly VITE_MAP_ASHEN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
