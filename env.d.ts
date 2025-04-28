/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OPEN_ROUTER_KEY: string;
    readonly VITE_HUGGING_FACE_TOKEN_1: string;
    readonly VITE_HUGGING_FACE_TOKEN_2: string;
    readonly VITE_HUGGING_FACE_TOKEN_3: string;
    readonly VITE_OPENWEATHER_API_KEY: string;
    readonly VITE_AIRVISUAL_API_KEY: string;
    readonly VITE_AGROMONITORING_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  