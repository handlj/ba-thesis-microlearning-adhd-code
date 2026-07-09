import type { Config } from "../services/types/config";

let config: Config | null = null;

export function setAppConfig(newConfig: Config): void {
  config = newConfig;
}

export function getAppConfig(): Config {
  if (!config) {
    throw new Error("Config has not been set yet.");
  }
  return config;
}
