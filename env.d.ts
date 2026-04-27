declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_MAPBOX_API_TOKEN: string;
    NEXT_PUBLIC_CLOUDINARY_KEY: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_SECRET: string;
    DATABASE_URL: string;
    // Auth.js v5
    AUTH_SECRET: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    NEXTAUTH_URL: string;
  }
}
