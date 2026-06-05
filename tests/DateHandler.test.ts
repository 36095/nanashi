// tests/DateHandler.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'; // Importa funciones de vitest
import DateHandler from '../src/DateHandler'; // Importa la clase

describe('DateHandler', () => {
  let fakeDate: Date;

  beforeEach(() => {
    // Configura una fecha fija antes de cada test
    fakeDate = new Date(2026, 5, 5, 14, 30, 45, 123); // Junio 5, 2026, 14:30:45.123
    vi.useFakeTimers(); // Activa temporizadores falsos
    vi.setSystemTime(fakeDate); // Establece la fecha falsa como la hora del sistema
  });

  afterEach(() => {
    vi.useRealTimers(); // Restaura los temporizadores reales después de cada test
  });

  it('debería devolver la fecha actual cuando se accede a la propiedad date', () => {
    const currentDate = DateHandler.date;
    expect(currentDate).toEqual(fakeDate);
  });

  it('debería formatear correctamente la hora (HH:MM:SS)', () => {
    expect(DateHandler.formatted).toBe('14:30:45'); // Usa la fecha falsa
  });

  it('debería formatear correctamente la hora con milisegundos (HH:MM:SS:MMM)', () => {
    expect(DateHandler.formatted_with_milliseconds).toBe('14:30:45:123'); // Usa la fecha falsa
  });

  it('debería manejar horas menores a 10 con ceros', () => {
    fakeDate = new Date(2026, 5, 5, 9, 8, 7, 6); // 09:08:07:006
    vi.setSystemTime(fakeDate);

    expect(DateHandler.formatted).toBe('09:08:07');
    expect(DateHandler.formatted_with_milliseconds).toBe('09:08:07:006');
  });

  it('debería manejar minutos menores a 10 con ceros', () => {
    fakeDate = new Date(2026, 5, 5, 15, 5, 30, 500); // 15:05:30:500
    vi.setSystemTime(fakeDate);

    expect(DateHandler.formatted).toBe('15:05:30');
    expect(DateHandler.formatted_with_milliseconds).toBe('15:05:30:500');
  });

  it('debería manejar segundos menores a 10 con ceros', () => {
    fakeDate = new Date(2026, 5, 5, 15, 30, 5, 500); // 15:30:05:500
    vi.setSystemTime(fakeDate);

    expect(DateHandler.formatted).toBe('15:30:05');
    expect(DateHandler.formatted_with_milliseconds).toBe('15:30:05:500');
  });

  it('debería manejar milisegundos menores a 10 con ceros', () => {
    fakeDate = new Date(2026, 5, 5, 15, 30, 45, 5); // 15:30:45:005
    vi.setSystemTime(fakeDate);

    expect(DateHandler.formatted_with_milliseconds).toBe('15:30:45:005');
  });

  it('debería manejar milisegundos menores a 100 con ceros', () => {
    fakeDate = new Date(2026, 5, 5, 15, 30, 45, 50); // 15:30:45:050
    vi.setSystemTime(fakeDate);

    expect(DateHandler.formatted_with_milliseconds).toBe('15:30:45:050');
  });
});
