import { Module } from "./types";

export type Config = {
  /**
   * IP/domain of the server
   */
  server: string;
  /**
   * Port of the IRC server
   */
  port: number;
  /**
   * Nickname
   */
  nick: string;
  /**
   * Username
   */
  userName: string;
  /**
   * Real name
   */
  realName: string;
  /**
   * Channels list
   */
  channels: string[];
  normalModules: Module[];
  alwaysModules: Module[];
  opts: {
    ANIRUDHGPT_TOKEN: string;
  };
};

export function defineConfig(config: Config) {
  return config;
}
