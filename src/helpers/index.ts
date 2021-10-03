export const isServer = () => typeof window === "undefined";
export const isClient = () => typeof window !== "undefined";

export * from "./explodeAddress";
export * from "./mapping";
export * from "./logger";
