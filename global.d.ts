// global.d.ts
export {};

declare global {
  interface Window {
    kakao: any; // Use 'any' or a more specific type if you have the type definitions
  }
  interface mapRef {
    current: any;
  }
  declare const kakao: any;
}
