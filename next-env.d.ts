/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "cloudinary-react";

type YOLO = any;

export {};

declare global {
  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
}
