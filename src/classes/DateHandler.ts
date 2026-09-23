export default class DateHandler {
  static get date(): Date {
    return new Date(); // Devuelve una nueva instancia cada vez
  }

  static get hours(): string {
    return this.date.getHours().toString().padStart(2, '0');
  }

  static get minutes(): string {
    return this.date.getMinutes().toString().padStart(2, '0');
  }

  static get seconds(): string {
    return this.date.getSeconds().toString().padStart(2, '0');
  }

  static get milliseconds(): string {
    return this.date.getMilliseconds().toString().padStart(3, '0');
  }

  // Métodos en lugar de propiedades calculadas estáticamente
  static get formatted(): string {
    return `${this.hours}:${this.minutes}:${this.seconds}`;
  }

  static get formatted_with_milliseconds(): string {
    return `${this.hours}:${this.minutes}:${this.seconds}:${this.milliseconds}`;
  }

  /**
   * Devuelve la fecha en formato "Month day, year".
   * Acepta los mismos argumentos que el constructor nativo de Date.
   */
  static docs_date(): string;
  static docs_date(value: string | number | Date): string;
  static docs_date(
    year: number,
    monthIndex: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    ms?: number
  ): string;
  static docs_date(
    arg0?: string | number | Date,
    arg1?: number,
    arg2?: number,
    arg3?: number,
    arg4?: number,
    arg5?: number,
    arg6?: number
  ): string {
    let targetDate: Date;

    if (arg0 === undefined) {
      targetDate = this.date;
    } else if (arg1 === undefined) {
      targetDate = new Date(arg0);
    } else {
      targetDate = new Date(arg0 as number, arg1, arg2, arg3, arg4, arg5, arg6);
    }

    return targetDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export { DateHandler };
