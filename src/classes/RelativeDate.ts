import DateHandler from './DateHandler';
import { ValueError } from '../Error';

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
  prefixes: { past?: string; future?: string };
  timePrefix: string;
  format: RelativeDateFormat;
  units: {
    second?: { singular: string; plural: string };
    minute?: { singular: string; plural: string };
    hour?: { singular: string; plural: string };
    day?: { singular: string; plural: string };
    month?: { singular: string; plural: string };
    year?: { singular: string; plural: string };
  };
}

const defaultFormat: FormatObject = {
  past: '{prefix} {value} {unit}',
  future: '{prefix} {value} {unit}',
  clockTime: '{prefix} {time}',
  timeOnly: '{value} {unit}',
};

const defaultI18n: RelativeDateI18nConfig = {
  justNow: 'justo ahora',
  inAMoment: 'en un momento',
  justNowMode: 'text',
  prefixes: { past: 'hace', future: 'en' },
  timePrefix: 'a las',
  format: defaultFormat,
  units: {
    second: { singular: 'segundo', plural: 'segundos' },
    minute: { singular: 'minuto', plural: 'minutos' },
    hour: { singular: 'hora', plural: 'horas' },
    day: { singular: 'día', plural: 'días' },
    month: { singular: 'mes', plural: 'meses' },
    year: { singular: 'año', plural: 'años' },
  },
};

type TimeUnit = keyof Required<RelativeDateI18nConfig>['units'];
type TimeFormat = '24h' | '12h';

export class RelativeDateChain {
  private mode: 'relative' | 'clockTime' | 'timeOnly' | 'fields';
  private date: Date;
  private customI18n?: Partial<RelativeDateI18nConfig>;
  private timeFormat?: TimeFormat;

  // Nuevas propiedades para el control granular de getFields
  private explicitFieldsMode?: string;
  private forceSeconds: boolean = false;
  private prefixOverride: boolean | string | undefined = undefined;

  constructor(
    mode: 'relative' | 'clockTime' | 'timeOnly' | 'fields',
    date?: Date | string
  ) {
    this.mode = mode;
    this.date =
      typeof date === 'string' ? new Date(date) : date || DateHandler.date;
  }

  i18n(config: Partial<RelativeDateI18nConfig>): this {
    this.customI18n = config;
    return this;
  }

  format(fmt: TimeFormat): this {
    this.timeFormat = fmt;
    return this;
  }

  now(): this {
    this.date = DateHandler.date;
    return this;
  }

  justNow(mode: JustNowMode): this {
    this.customI18n = { ...(this.customI18n || {}), justNowMode: mode };
    return this;
  }

  /**
   * Define los campos a mostrar. Si se omite, se usa el modo "auto" (oculta ceros).
   */
  fields(mode?: string): this {
    this.mode = 'fields';
    this.explicitFieldsMode = mode;
    return this;
  }

  /**
   * Fuerza la inclusión del campo de segundos, incluso si su valor es 0.
   */
  seconds(show: boolean): this {
    this.forceSeconds = show;
    return this;
  }

  /**
   * Controla el prefijo.
   * - `true`: usa el prefijo por defecto de la configuración ("en" / "hace").
   * - `string`: usa el texto proporcionado.
   * - `false` o no llamado: no agrega prefijo.
   */
  prefix(enabled: boolean | string): this {
    this.prefixOverride = enabled;
    return this;
  }

  value(): string {
    const rd = new RelativeDate(this.date, this.customI18n);
    if (this.mode === 'clockTime') return rd.getClockTime(this.timeFormat);
    if (this.mode === 'timeOnly') return rd.getTimeOnly();
    if (this.mode === 'fields') {
      return rd.getFields(
        this.explicitFieldsMode,
        this.forceSeconds,
        this.prefixOverride
      );
    }
    return rd.getRelative();
  }

  get(): string {
    return this.value();
  }
  toString(): string {
    return this.value();
  }
  valueOf(): string {
    return this.value();
  }
}

export default class RelativeDate {
  static globalConfig: Partial<RelativeDateI18nConfig> = {};

  static config(cfg: Partial<RelativeDateI18nConfig>): void {
    RelativeDate.globalConfig = cfg;
  }

  private readonly targetDate: Date;
  private readonly i18n: RelativeDateI18nConfig;

  constructor(targetDate?: Date, i18n?: Partial<RelativeDateI18nConfig>) {
    this.targetDate = targetDate || DateHandler.date;
    this.i18n = this.mergeI18n(i18n);
  }

  private mergeI18n(
    custom?: Partial<RelativeDateI18nConfig>
  ): RelativeDateI18nConfig {
    const global = RelativeDate.globalConfig || {};
    const getFmtObj = (
      fmt: RelativeDateFormat | undefined
    ): FormatObject | undefined =>
      typeof fmt === 'string' || !fmt ? undefined : fmt;

    const globalFmt = getFmtObj(global.format);
    const customFmt = getFmtObj(custom?.format);

    const resolvedFormat: RelativeDateFormat =
      typeof custom?.format === 'string' ?
        custom.format
      : {
          past: customFmt?.past ?? globalFmt?.past ?? defaultFormat.past,
          future:
            customFmt?.future ?? globalFmt?.future ?? defaultFormat.future,
          clockTime:
            customFmt?.clockTime ??
            globalFmt?.clockTime ??
            defaultFormat.clockTime,
          timeOnly:
            customFmt?.timeOnly ??
            globalFmt?.timeOnly ??
            defaultFormat.timeOnly,
        };

    return {
      justNow: custom?.justNow ?? global.justNow ?? defaultI18n.justNow,
      inAMoment: custom?.inAMoment ?? global.inAMoment ?? defaultI18n.inAMoment,
      justNowMode:
        custom?.justNowMode ?? global.justNowMode ?? defaultI18n.justNowMode,
      prefixes: {
        past:
          custom?.prefixes?.past ??
          global.prefixes?.past ??
          defaultI18n.prefixes.past,
        future:
          custom?.prefixes?.future ??
          global.prefixes?.future ??
          defaultI18n.prefixes.future,
      },
      timePrefix:
        custom?.timePrefix ?? global.timePrefix ?? defaultI18n.timePrefix,
      format: resolvedFormat,
      units: {
        second: {
          singular:
            custom?.units?.second?.singular ??
            global.units?.second?.singular ??
            defaultI18n.units.second?.singular ??
            'second',
          plural:
            custom?.units?.second?.plural ??
            global.units?.second?.plural ??
            defaultI18n.units.second?.plural ??
            'seconds',
        },
        minute: {
          singular:
            custom?.units?.minute?.singular ??
            global.units?.minute?.singular ??
            defaultI18n.units.minute?.singular ??
            'minute',
          plural:
            custom?.units?.minute?.plural ??
            global.units?.minute?.plural ??
            defaultI18n.units.minute?.plural ??
            'minutes',
        },
        hour: {
          singular:
            custom?.units?.hour?.singular ??
            global.units?.hour?.singular ??
            defaultI18n.units.hour?.singular ??
            'hour',
          plural:
            custom?.units?.hour?.plural ??
            global.units?.hour?.plural ??
            defaultI18n.units.hour?.plural ??
            'hours',
        },
        day: {
          singular:
            custom?.units?.day?.singular ??
            global.units?.day?.singular ??
            defaultI18n.units.day?.singular ??
            'day',
          plural:
            custom?.units?.day?.plural ??
            global.units?.day?.plural ??
            defaultI18n.units.day?.plural ??
            'days',
        },
        month: {
          singular:
            custom?.units?.month?.singular ??
            global.units?.month?.singular ??
            defaultI18n.units.month?.singular ??
            'month',
          plural:
            custom?.units?.month?.plural ??
            global.units?.month?.plural ??
            defaultI18n.units.month?.plural ??
            'months',
        },
        year: {
          singular:
            custom?.units?.year?.singular ??
            global.units?.year?.singular ??
            defaultI18n.units.year?.singular ??
            'year',
          plural:
            custom?.units?.year?.plural ??
            global.units?.year?.plural ??
            defaultI18n.units.year?.plural ??
            'years',
        },
      },
    };
  }

  private interpolate(
    template: string,
    data: Record<string, string | number>
  ): string {
    return template
      .replace(/\{(\w+)\}/g, (_, key) => String(data[key] ?? '').trim())
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getRelativeData() {
    const now = DateHandler.date;
    const diffSec = Math.round(
      (this.targetDate.getTime() - now.getTime()) / 1000
    );
    const isFuture = diffSec > 0;
    const absSec = Math.abs(diffSec);

    let isNow = false;
    let category: TimeUnit = 'second';
    let value = absSec;
    const mode = this.i18n.justNowMode ?? 'text';

    if (absSec === 0) {
      isNow = true;
    } else if (absSec < 60) {
      if (mode === 'text') isNow = true;
      else {
        category = 'second';
        value = absSec;
      }
    } else if (absSec < 3600) {
      category = 'minute';
      value = Math.floor(absSec / 60);
    } else if (absSec < 86400) {
      category = 'hour';
      value = Math.floor(absSec / 3600);
    } else if (absSec < 2592000) {
      category = 'day';
      value = Math.floor(absSec / 86400);
    } else if (absSec < 31536000) {
      category = 'month';
      value = Math.floor(absSec / 2592000);
    } else {
      category = 'year';
      value = Math.floor(absSec / 31536000);
    }

    const unitConfig = this.i18n.units[category];
    const defaultUnit = defaultI18n.units[category];
    const unit =
      value === 1 ?
        (unitConfig?.singular ?? defaultUnit?.singular ?? 'second')
      : (unitConfig?.plural ?? defaultUnit?.plural ?? 'seconds');

    return { isNow, isFuture, category, value, unit };
  }

  public getRelative(): string {
    const { isNow, isFuture, value, unit } = this.getRelativeData();
    if (isNow) return isFuture ? this.i18n.inAMoment : this.i18n.justNow;

    const prefix =
      isFuture ?
        (this.i18n.prefixes.future ?? 'en')
      : (this.i18n.prefixes.past ?? 'hace');
    const fmt = this.i18n.format;
    const formatStr =
      typeof fmt === 'string' ? fmt
      : isFuture ? (fmt.future ?? '{prefix} {value} {unit}')
      : (fmt.past ?? '{prefix} {value} {unit}');

    return this.interpolate(formatStr, { prefix, value, unit });
  }

  public getFields(
    explicitMode?: string,
    forceSeconds: boolean = false,
    prefixOverride?: boolean | string
  ): string {
    const now = DateHandler.date;
    const diffSec = Math.round(
      (this.targetDate.getTime() - now.getTime()) / 1000
    );
    const absSec = Math.abs(diffSec);
    const isFuture = diffSec >= 0;

    let remaining = absSec;
    const years = Math.floor(remaining / 31536000);
    remaining %= 31536000;
    const months = Math.floor(remaining / 2592000);
    remaining %= 2592000;
    const days = Math.floor(remaining / 86400);
    remaining %= 86400;
    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    const values: Record<string, number> = {
      y: years,
      M: months,
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
    };
    const unitsMap: Record<string, TimeUnit> = {
      y: 'year',
      M: 'month',
      d: 'day',
      h: 'hour',
      m: 'minute',
      s: 'second',
    };
    const validFields = new Set(['y', 'M', 'd', 'h', 'm', 's']);

    let fieldsToInclude: string[] = [];

    if (explicitMode === 'all') {
      fieldsToInclude = ['y', 'M', 'd', 'h', 'm'];
      // CORRECCIÓN: Si se fuerza segundos, agregarlos al modo 'all'
      if (forceSeconds) {
        fieldsToInclude.push('s');
      }
    } else if (explicitMode === 'all-seconds') {
      fieldsToInclude = ['y', 'M', 'd', 'h', 'm', 's'];
    } else if (explicitMode) {
      // Modo explícito por comas: validar y usar exactamente lo pedido
      const parsed = explicitMode
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      for (const field of parsed) {
        if (!validFields.has(field)) {
          throw new ValueError(
            `Invalid field '${field}'. Valid fields are: y (year), M (month), d (day), h (hour), m (minute), s (second). Note: 'M' is case-sensitive (months), 'm' is minutes.`
          );
        }
      }
      fieldsToInclude = parsed;
      if (forceSeconds && !fieldsToInclude.includes('s')) {
        fieldsToInclude.push('s');
      }
    } else {
      // Modo "Auto": ocultar ceros, pero respetar forceSeconds para los segundos
      const baseFields = ['y', 'M', 'd', 'h', 'm'];
      fieldsToInclude = baseFields.filter(
        (f) => values[f as keyof typeof values] > 0
      );

      if (forceSeconds || values.s > 0) {
        fieldsToInclude.push('s');
      }

      // Fallback si todo es 0 y no se forzó nada: mostrar 0 segundos
      if (fieldsToInclude.length === 0) {
        fieldsToInclude.push('s');
      }
    }

    // Lógica del prefijo
    let prefixStr = '';
    if (prefixOverride !== undefined) {
      if (typeof prefixOverride === 'string') {
        prefixStr = prefixOverride;
      } else if (prefixOverride === true) {
        prefixStr =
          isFuture ?
            (this.i18n.prefixes.future ?? 'en')
          : (this.i18n.prefixes.past ?? 'hace');
      }
    }

    const parts: string[] = [];
    for (const field of fieldsToInclude) {
      const val = values[field];
      const unitKey = unitsMap[field];
      const unitConfig = this.i18n.units[unitKey];
      const defaultUnit = defaultI18n.units[unitKey];
      const unitName =
        val === 1 ?
          (unitConfig?.singular ?? defaultUnit?.singular ?? unitKey)
        : (unitConfig?.plural ?? defaultUnit?.plural ?? `${unitKey}s`);

      parts.push(`${val} ${unitName}`);
    }

    const result = parts.join(', ');
    return prefixStr ? `${prefixStr} ${result}`.trim() : result;
  }

  public getClockTime(format: TimeFormat = '24h'): string {
    const hours = this.targetDate.getHours();
    const minutes = this.targetDate.getMinutes().toString().padStart(2, '0');
    const timeString =
      format === '12h' ?
        `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`
      : `${hours.toString().padStart(2, '0')}:${minutes}`;

    const fmt = this.i18n.format;
    const formatStr =
      typeof fmt === 'string' ? fmt : (fmt.clockTime ?? '{prefix} {time}');
    return this.interpolate(formatStr, {
      prefix: this.i18n.timePrefix,
      time: timeString,
      value: timeString,
      unit: '',
    });
  }

  public getTimeOnly(): string {
    const { isNow, value, unit } = this.getRelativeData();
    if (isNow) return this.i18n.justNow;

    const fmt = this.i18n.format;
    const formatStr =
      typeof fmt === 'string' ? fmt : (fmt.timeOnly ?? '{value} {unit}');
    return this.interpolate(formatStr, { value, unit, prefix: '', time: '' });
  }

  static getRelative(date?: Date | string): RelativeDateChain {
    return new RelativeDateChain('relative', date);
  }
  static getClockTime(date?: Date | string): RelativeDateChain {
    return new RelativeDateChain('clockTime', date);
  }
  static getTimeOnly(date?: Date | string): RelativeDateChain {
    return new RelativeDateChain('timeOnly', date);
  }
  static getFields(date?: Date | string): RelativeDateChain {
    return new RelativeDateChain('fields', date);
  }
}

export { RelativeDate };
