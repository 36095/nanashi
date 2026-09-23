//------------------------------------------------------------------------------
// @36095/nanashi v0.0.2-prerelease.1
// This code is part of https://github.com/36095/nanashi
//
// Author: Mario Plaza <me@mplaza.cl>
// Contributors: 
//   - Mario Plaza <me@mplaza.cl> (https://mplaza.cl),
//   - 36095 <36095@mplaza.cl> (https://mplaza.cl/github)
// Build Date: September 23, 2026
// License: MIT
//------------------------------------------------------------------------------
import { LogLevel, LogType } from "../types.mjs";
//#region src/classes/Logger.d.ts
export declare let logLevel: LogLevel;
export declare const levelPriority: Record<LogLevel, number>;
export declare const colors: Record<LogType, string>;
export default class Logger {
  /**
   * @param level LogLevel to output
   * @param message Message to output
   * @returns {void} void
   */
  static log(level: LogLevel | undefined, message: string): void;
  /**
   * Clear the screen
   * @returns {void} void
   */
  static clear(): void;
  /**
   * Prints the provided `message` to stderr and exits the process
   * @param message Message to print
   * @param error Optional error to print
   * @returns {never}
   */
  static fatal(message: string, error?: Error | string | undefined): never;
}
/**
 * @deprecated Use {@link Logger.log} instead
 */
export declare function log(level: LogLevel | undefined, message: string): void;
/**
 * Clear the screen
 * @deprecated Use {@link Logger.clear} instead
 */
export declare function clear(): void;
/**
 * Prints the provided `message` to stderr and exits the process
 * @deprecated Use {@link Logger.fatal} instead
 */
export declare function fatal(message: string, error?: Error | string | undefined): never;
//#endregion
export { log as logger };
// made with ❤️ in chile