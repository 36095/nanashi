//------------------------------------------------------------------------------
// nanashi v0.0.0
// This code is part of https://github.com/36095/nanashi#readme
//
// Author: Mario Plaza <mario@mplaza.cl>
// Contributors: none
// Date: June 04, 2026
// License: MIT
//------------------------------------------------------------------------------
//#region src/DateHandler.d.ts
declare class DateHandler {
  static get date(): Date;
  static get hours(): string;
  static get minutes(): string;
  static get seconds(): string;
  static get milliseconds(): string;
  static get formatted(): string;
  static get formatted_with_milliseconds(): string;
}
//#endregion
//#region src/types.d.ts
type LogLevel = 'debug' | 'info' | 'silly' | 'success' | 'error' | 'warning';
type LogType = 'debug' | 'info' | 'silly' | 'error' | 'warning' | 'success' | 'reset' | 'simple_reset' | 'dim_white';
//#endregion
//#region src/logger.d.ts
declare let logLevel: LogLevel;
declare const levelPriority: Record<LogLevel, number>;
declare const colors: Record<LogType, string>;
declare function logger(level: LogLevel | undefined, message: string): void;
declare function clear(): void;
//#endregion
export { DateHandler, type LogLevel, type LogType, clear, colors, levelPriority, logLevel, logger };
// made with <3 in chile