declare module 'qrcode' {
    interface QRCodeToDataURLOptions {
      errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high';
      type?: 'image/png' | 'image/jpeg' | 'image/webp';
      width?: number;
      margin?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    }
  
    export function toDataURL(
      text: string,
      options?: QRCodeToDataURLOptions
    ): Promise<string>;
  
    export function toFile(
      path: string,
      text: string,
      options?: QRCodeToDataURLOptions
    ): Promise<void>;
  
    export function toString(
      text: string,
      options?: QRCodeToDataURLOptions
    ): Promise<string>;
  }
  