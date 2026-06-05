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
}

export { DateHandler };
