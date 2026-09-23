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
//#region src/classes/RelativeDate.d.ts
export type FormatObject = {
  past?: string;
  future?: string;
  clockTime?: string;
  timeOnly?: string;
};
export type RelativeDateFormat = string | FormatObject;
export type JustNowMode = 'text' | 'seconds';
export interface RelativeDateI18nConfig {
  justNow: string;
  inAMoment: string;
  justNowMode?: JustNowMode;
  prefixes: {
    past?: string;
    future?: string;
  };
  timePrefix: string;
  format: RelativeDateFormat;
  units: {
    second?: {
      singular: string;
      plural: string;
    };
    minute?: {
      singular: string;
      plural: string;
    };
    hour?: {
      singular: string;
      plural: string;
    };
    day?: {
      singular: string;
      plural: string;
    };
    month?: {
      singular: string;
      plural: string;
    };
    year?: {
      singular: string;
      plural: string;
    };
  };
}
type TimeFormat = '24h' | '12h';
export declare class RelativeDateChain {
  private mode;
  private date;
  private customI18n?;
  private timeFormat?;
  private explicitFieldsMode?;
  private forceSeconds;
  private prefixOverride;
  constructor(mode: 'relative' | 'clockTime' | 'timeOnly' | 'fields', date?: Date | string);
  i18n(config: Partial<RelativeDateI18nConfig>): this;
  format(fmt: TimeFormat): this;
  now(): this;
  justNow(mode: JustNowMode): this;
  /**
   * Define los campos a mostrar. Si se omite, se usa el modo "auto" (oculta ceros).
   */
  fields(mode?: string): this;
  /**
   * Fuerza la inclusión del campo de segundos, incluso si su valor es 0.
   */
  seconds(show: boolean): this;
  /**
   * Controla el prefijo.
   * - `true`: usa el prefijo por defecto de la configuración ("en" / "hace").
   * - `string`: usa el texto proporcionado.
   * - `false` o no llamado: no agrega prefijo.
   */
  prefix(enabled: boolean | string): this;
  value(): string;
  get(): string;
  toString(): string;
  valueOf(): string;
}
export default class RelativeDate {
  static globalConfig: Partial<RelativeDateI18nConfig>;
  static config(cfg: Partial<RelativeDateI18nConfig>): void;
  private readonly targetDate;
  private readonly i18n;
  constructor(targetDate?: Date, i18n?: Partial<RelativeDateI18nConfig>);
  private mergeI18n;
  private interpolate;
  private getRelativeData;
  getRelative(): string;
  getFields(explicitMode?: string, forceSeconds?: boolean, prefixOverride?: boolean | string): string;
  getClockTime(format?: TimeFormat): string;
  getTimeOnly(): string;
  static getRelative(date?: Date | string): RelativeDateChain;
  static getClockTime(date?: Date | string): RelativeDateChain;
  static getTimeOnly(date?: Date | string): RelativeDateChain;
  static getFields(date?: Date | string): RelativeDateChain;
}
//#endregion
export { RelativeDate };
// made with ❤️ in chile