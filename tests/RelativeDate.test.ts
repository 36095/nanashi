import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RelativeDate, {
  type RelativeDateI18nConfig,
} from '../src/classes/RelativeDate.ts';
import { ValueError } from '../src/Error.ts';

describe('RelativeDate', () => {
  let fakeDate: Date;

  beforeEach(() => {
    // Restablecer configuración global para evitar contaminación entre tests
    RelativeDate.config({});

    // Fecha base fija: 8 de Septiembre de 2026, 12:00:00.000
    fakeDate = new Date(2026, 8, 8, 12, 0, 0, 0);
    vi.useFakeTimers();
    vi.setSystemTime(fakeDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Tiempos relativos (getRelative)', () => {
    it('debería devolver "justo ahora" para diferencia de 0s, sin importar el modo', () => {
      const target = new Date(2026, 8, 8, 12, 0, 0); // Exactamente la fecha fake

      expect(RelativeDate.getRelative(target).value()).toBe('justo ahora');
      expect(RelativeDate.getRelative(target).justNow('seconds').value()).toBe(
        'justo ahora'
      );
    });

    it('debería devolver texto ("justo ahora" / "en un momento") para < 60s por defecto', () => {
      const past = new Date(2026, 8, 8, 11, 59, 30); // 30s atrás
      const future = new Date(2026, 8, 8, 12, 0, 45); // 45s adelante

      expect(RelativeDate.getRelative(past).value()).toBe('justo ahora');
      expect(RelativeDate.getRelative(future).value()).toBe('en un momento');
    });

    it('debería devolver segundos exactos cuando se usa .justNow("seconds")', () => {
      const past = new Date(2026, 8, 8, 11, 59, 15); // 45s atrás
      const future = new Date(2026, 8, 8, 12, 0, 50); // 50s adelante

      expect(RelativeDate.getRelative(past).justNow('seconds').value()).toBe(
        'hace 45 segundos'
      );
      expect(RelativeDate.getRelative(future).justNow('seconds').value()).toBe(
        'en 50 segundos'
      );
    });

    it('debería respetar justNowMode: "seconds" en la configuración global', () => {
      RelativeDate.config({ justNowMode: 'seconds' });

      const past = new Date(2026, 8, 8, 11, 59, 20); // 40s atrás
      expect(RelativeDate.getRelative(past).value()).toBe('hace 40 segundos');

      // Pero 0s sigue siendo "justo ahora" inquebrantablemente
      const now = new Date(2026, 8, 8, 12, 0, 0);
      expect(RelativeDate.getRelative(now).value()).toBe('justo ahora');
    });

    it('debería formatear correctamente los minutos (< 60m)', () => {
      const past = new Date(2026, 8, 8, 11, 15, 0); // 45m atrás
      const future = new Date(2026, 8, 8, 12, 55, 0); // 55m adelante

      expect(RelativeDate.getRelative(past).value()).toBe('hace 45 minutos');
      expect(RelativeDate.getRelative(future).value()).toBe('en 55 minutos');
    });

    it('debería formatear correctamente las horas (< 24h)', () => {
      const past = new Date(2026, 8, 7, 13, 0, 0); // 23h atrás
      const future = new Date(2026, 8, 9, 11, 0, 0); // 23h adelante

      expect(RelativeDate.getRelative(past).value()).toBe('hace 23 horas');
      expect(RelativeDate.getRelative(future).value()).toBe('en 23 horas');
    });

    it('debería formatear correctamente días, meses y años (>= 24h)', () => {
      const daysPast = new Date(2026, 8, 6, 12, 0, 0); // 2 días atrás
      const monthsFuture = new Date(2027, 2, 8, 12, 0, 0); // ~6 meses adelante
      const yearsPast = new Date(2024, 8, 8, 12, 0, 0); // 2 años atrás

      expect(RelativeDate.getRelative(daysPast).value()).toBe('hace 2 días');
      expect(RelativeDate.getRelative(monthsFuture).value()).toBe('en 6 meses');
      expect(RelativeDate.getRelative(yearsPast).value()).toBe('hace 2 años');
    });
  });

  describe('Hora del reloj (getClockTime)', () => {
    it('debería formatear en 24h por defecto', () => {
      const target = new Date(2026, 8, 8, 14, 30, 0);
      expect(RelativeDate.getClockTime(target).value()).toBe('a las 14:30');
    });

    it('debería formatear en 12h con AM/PM correctamente', () => {
      const afternoon = new Date(2026, 8, 8, 14, 30, 0);
      const midnight = new Date(2026, 8, 8, 0, 5, 0);
      const noon = new Date(2026, 8, 8, 12, 0, 0);

      expect(RelativeDate.getClockTime(afternoon).format('12h').value()).toBe(
        'a las 02:30 PM'
      );
      expect(RelativeDate.getClockTime(midnight).format('12h').value()).toBe(
        'a las 12:05 AM'
      );
      expect(RelativeDate.getClockTime(noon).format('12h').value()).toBe(
        'a las 12:00 PM'
      );
    });

    it('debería usar la fecha del sistema si no se proporciona ninguna', () => {
      expect(RelativeDate.getClockTime().value()).toBe('a las 12:00');
    });
  });

  describe('Solo tiempo (getTimeOnly)', () => {
    it('debería devolver solo valor y unidad sin prefijos de tiempo', () => {
      const past = new Date(2026, 8, 8, 11, 15, 0); // 45m atrás
      const future = new Date(2026, 8, 9, 12, 0, 0); // 1 día adelante

      expect(RelativeDate.getTimeOnly(past).value()).toBe('45 minutos');
      expect(RelativeDate.getTimeOnly(future).value()).toBe('1 día');
    });

    it('debería devolver "justo ahora" para diferencias de 0s', () => {
      const target = new Date(2026, 8, 8, 12, 0, 0);
      expect(RelativeDate.getTimeOnly(target).value()).toBe('justo ahora');
    });
  });

  describe('Configuración e i18n', () => {
    it('debería aplicar la configuración global', () => {
      RelativeDate.config({
        timePrefix: 'at',
        prefixes: { past: 'ago', future: 'in' },
        format: {
          past: '{value} {unit} {prefix}',
          future: '{prefix} {value} {unit}',
        },
        units: {
          second: { singular: 'second', plural: 'seconds' },
          month: { singular: 'month', plural: 'months' },
          year: { singular: 'year', plural: 'years' },
        },
        justNow: 'just now',
        justNowMode: 'seconds',
      });

      const past = new Date(2026, 8, 8, 11, 59, 30); // 30s atrás
      const future = new Date(2026, 8, 8, 12, 0, 45); // 45s adelante
      const clock = new Date(2026, 8, 8, 14, 30, 0);
      const in1Year = new Date(2027, 8, 8, 12, 0, 0);
      const in12Months = new Date(2027, 8, 8, 0, 0, 0);

      expect(RelativeDate.getRelative(past).value()).toBe('30 seconds ago');
      expect(RelativeDate.getRelative(future).value()).toBe('in 45 seconds');
      expect(RelativeDate.getClockTime(clock).value()).toBe('at 14:30');
      expect(RelativeDate.getRelative(in1Year).value()).toBe('in 1 year');
      expect(RelativeDate.getRelative(in12Months).value()).toBe('in 12 months');
    });

    it('debería permitir sobrescritura local mediante .i18n()', () => {
      const customConfig: Partial<RelativeDateI18nConfig> = {
        prefixes: { past: 'hace', future: 'dentro de' },
      };
      const target = new Date(2026, 8, 8, 11, 59, 30); // 30s atrás

      expect(
        RelativeDate.getRelative(target)
          .i18n(customConfig)
          .justNow('seconds')
          .value()
      ).toBe('hace 30 segundos');
    });

    it('debería permitir encadenamiento en cualquier orden', () => {
      const target = new Date(2026, 8, 8, 14, 30, 0);
      const customConfig: Partial<RelativeDateI18nConfig> = {
        timePrefix: 'on',
      };

      const result1 = RelativeDate.getClockTime(target)
        .i18n(customConfig)
        .format('12h')
        .value();
      const result2 = RelativeDate.getClockTime(target)
        .format('12h')
        .i18n(customConfig)
        .value();

      expect(result1).toBe('on 02:30 PM');
      expect(result2).toBe('on 02:30 PM');
    });

    it('debería convertir implícitamente a string en template literals', () => {
      const target = new Date(2026, 8, 8, 11, 59, 30);
      const chain = RelativeDate.getRelative(target);

      expect(`${chain}`).toBe('justo ahora');
    });

    it('debería permitir reiniciar la fecha a "ahora" con .now()', () => {
      const past = new Date(2026, 8, 8, 11, 59, 30);
      const chain = RelativeDate.getRelative(past)
        .now()
        .i18n({ justNow: 'ahora mismo' });

      expect(chain.value()).toBe('ahora mismo');
    });
  });

  describe('Campos específicos (getFields)', () => {
    it('debería ocultar campos con valor 0 en modo auto (sin argumentos)', () => {
      // +1 día, +10 minutos, +20 segundos (0 años, 0 meses, 0 horas)
      const target = new Date(2026, 8, 9, 12, 10, 20);
      expect(RelativeDate.getFields(target).value()).toBe(
        '1 día, 10 minutos, 20 segundos'
      );
    });

    it('debería ocultar segundos si son 0, a menos que se fuerce con .seconds(true)', () => {
      // +5 minutos, 0 segundos
      const target = new Date(2026, 8, 8, 12, 5, 0);

      expect(RelativeDate.getFields(target).value()).toBe('5 minutos');
      expect(RelativeDate.getFields(target).seconds(true).value()).toBe(
        '5 minutos, 0 segundos'
      );
    });

    it('debería mostrar segundos en modo auto si el valor es > 0', () => {
      // +10 minutos, 20 segundos
      const target = new Date(2026, 8, 8, 12, 10, 20);
      expect(RelativeDate.getFields(target).value()).toBe(
        '10 minutos, 20 segundos'
      );
    });

    it('debería agregar el prefijo solo si se especifica .prefix()', () => {
      // Futuro: +1 día, +10 minutos, +20 segundos
      const target = new Date(2026, 8, 9, 12, 10, 20);

      // Sin prefijo (por defecto)
      expect(RelativeDate.getFields(target).value()).toBe(
        '1 día, 10 minutos, 20 segundos'
      );

      // Con prefijo por defecto (boolean true)
      expect(RelativeDate.getFields(target).prefix(true).value()).toBe(
        'en 1 día, 10 minutos, 20 segundos'
      );

      // Con prefijo personalizado (string)
      expect(RelativeDate.getFields(target).prefix('dentro de').value()).toBe(
        'dentro de 1 día, 10 minutos, 20 segundos'
      );
    });

    it('debería manejar el pasado correctamente con .prefix(true)', () => {
      // Pasado: -1 día, -10 minutos, -20 segundos
      const target = new Date(2026, 8, 7, 11, 49, 40);
      expect(RelativeDate.getFields(target).prefix(true).value()).toBe(
        'hace 1 día, 10 minutos, 20 segundos'
      );
    });

    it('debería devolver el desglose completo sin segundos (all)', () => {
      // +1 año, +3 meses, +5 días, +4 horas, +25 minutos
      const target = new Date(2027, 11, 13, 16, 25, 0);
      expect(RelativeDate.getFields(target).fields('all').value()).toBe(
        '1 año, 3 meses, 6 días, 4 horas, 25 minutos'
      );
    });

    it('debería devolver el desglose completo con segundos (all-seconds)', () => {
      // Pasado: -8 meses, -1 día, -8 horas, -10 minutos, -20 segundos
      const target = new Date(2025, 0, 9, 3, 49, 40);
      expect(RelativeDate.getFields(target).fields('all-seconds').value()).toBe(
        '1 año, 8 meses, 2 días, 8 horas, 10 minutos, 20 segundos'
      );
    });

    it('debería permitir forzar segundos en "all" con .seconds(true) y no mostrarlos cuando .seconds(false)', () => {
      const target = new Date(2027, 11, 13, 16, 25, 0);
      expect(
        RelativeDate.getFields(target).fields('all').seconds(true).value()
      ).toBe('1 año, 3 meses, 6 días, 4 horas, 25 minutos, 0 segundos');
      expect(
        RelativeDate.getFields(target).fields('all').seconds(false).value()
      ).toBe('1 año, 3 meses, 6 días, 4 horas, 25 minutos');
    });

    it('debería distinguir entre M (meses) y m (minutos) en modo explícito (case-sensitive)', () => {
      // +1 hora, +20 minutos, +30 segundos
      const target = new Date(2026, 8, 8, 13, 20, 30);

      expect(RelativeDate.getFields(target).fields('M').value()).toBe(
        '0 meses'
      );
      expect(RelativeDate.getFields(target).fields('m').value()).toBe(
        '20 minutos'
      );
      expect(RelativeDate.getFields(target).fields('M,m').value()).toBe(
        '0 meses, 20 minutos'
      );
    });

    it('debería permitir solicitar campos específicos separados por comas', () => {
      const target = new Date(2026, 8, 8, 13, 20, 30);

      expect(RelativeDate.getFields(target).fields('m,s').value()).toBe(
        '20 minutos, 30 segundos'
      );
      expect(RelativeDate.getFields(target).fields('h,m').value()).toBe(
        '1 hora, 20 minutos'
      );
      expect(RelativeDate.getFields(target).fields('h,s').value()).toBe(
        '1 hora, 30 segundos'
      );
    });

    it('debería lanzar ValueError si se especifican campos inválidos en modo explícito', () => {
      const target = new Date(2026, 8, 8, 13, 20, 30);

      expect(() =>
        RelativeDate.getFields(target).fields('x,z').value()
      ).toThrow(ValueError);
    });

    it('el ValueError debe describir el campo inválido y el uso correcto', () => {
      const target = new Date(2026, 8, 8, 13, 20, 30);

      expect(() =>
        RelativeDate.getFields(target).fields('h,x,m').value()
      ).toThrow(/Invalid field 'x'/);
      expect(() =>
        RelativeDate.getFields(target).fields('h,x,m').value()
      ).toThrow(
        /Valid fields are: y \(year\), M \(month\), d \(day\), h \(hour\), m \(minute\), s \(second\)/
      );
      expect(() => RelativeDate.getFields(target).fields('X').value()).toThrow(
        /case-sensitive/
      );
    });

    it('debería devolver "0 segundos" como fallback si todo es 0 en modo auto', () => {
      const target = new Date(2026, 8, 8, 12, 0, 0); // Diferencia exacta de 0

      const result = RelativeDate.getFields(target).value();
      expect(result).not.toBe('justo ahora');
      expect(result).toBe('0 segundos');
    });

    it('debería funcionar con la API encadenable y configuración personalizada', () => {
      const target = new Date(2026, 8, 8, 13, 20, 0); // +1 hora, +20 minutos
      const customConfig: Partial<RelativeDateI18nConfig> = {
        prefixes: { future: 'within' },
        units: {
          hour: { singular: 'hr', plural: 'hrs' },
          minute: { singular: 'min', plural: 'mins' },
        },
      };

      const result = RelativeDate.getFields(target)
        .i18n(customConfig)
        .prefix(true)
        .fields('h,m')
        .value();

      expect(result).toBe('within 1 hr, 20 mins');
    });
  });
});
