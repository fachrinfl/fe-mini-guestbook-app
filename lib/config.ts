export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001",
  TIMEOUT: 10000,
} as const;

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
