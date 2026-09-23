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
//#region src/classes/DateHandler.d.ts
export default class DateHandler {
  static get date(): Date;
  static get hours(): string;
  static get minutes(): string;
  static get seconds(): string;
  static get milliseconds(): string;
  static get formatted(): string;
  static get formatted_with_milliseconds(): string;
  /**
   * Devuelve la fecha en formato "Month day, year".
   * Acepta los mismos argumentos que el constructor nativo de Date.
   */
  static docs_date(): string;
  static docs_date(value: string | number | Date): string;
  static docs_date(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): string;
}
//#endregion
export { DateHandler };
// made with ❤️ in chile