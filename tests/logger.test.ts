// tests/logger.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Logger', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let mockWrite: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.NODE_ENV = 'development'; // Asegura entorno desarrollo por defecto

    mockWrite = vi.fn().mockReturnValue(true);
    (process.stdout as any).write = mockWrite;
  });

  afterEach(() => {
    process.env = originalEnv;
    delete (process.stdout as any).write;
  });

  it('debería escribir un mensaje info con formato correcto (HH:MM:SS) cuando logLevel es info', async () => {
    mockWrite.mockClear();

    const { default: logger } = await import('../src/logger');

    logger('info', 'Hola');

    expect(mockWrite).toHaveBeenCalledTimes(1);
    const call = mockWrite.mock.calls[0][0] as string;
    // Regex actualizada para tolerar códigos de color ANSI
    // Busca HH:MM:SS, luego [INFO], luego 'Hola', y finaliza con \n
    expect(call).toMatch(/\d{2}:\d{2}:\d{2}.*?\[INFO\].*?Hola\n$/);
  });

  // Este test verifica que 'silly' NO se imprima cuando logLevel es 'info'
  it('debería filtrar un mensaje silly cuando logLevel es info', async () => {
    mockWrite.mockClear();

    const { default: logger } = await import('../src/logger');

    logger('silly', 'Hola Silly'); // logLevel es 'info' (2), silly es (0), 0 < 2 -> filtra

    expect(mockWrite).toHaveBeenCalledTimes(0); // No debería escribirse
  });

  it('debería filtrar debug y success cuando NODE_ENV=production', async () => {
    mockWrite.mockClear();
    process.env.NODE_ENV = 'production';

    const { default: logger } = await import('../src/logger');

    logger('debug', 'msg debug');
    logger('success', 'msg success');
    logger('warning', 'msg warning');

    expect(mockWrite).toHaveBeenCalledTimes(1); // Solo warning debe escribirse
    const call = mockWrite.mock.calls[0][0] as string;
    // Regex actualizada para tolerar códigos de color ANSI para WARNING
    expect(call).toMatch(/.*?\[WARNING\].*?msg warning\n$/);

    // Verifica que no se haya llamado con debug o success
    // Opcional: también verificar que no contenga los mensajes filtrados
    const allCalls = mockWrite.mock.calls.flat().join('');
    expect(allCalls).not.toContain('[DEBUG]');
    expect(allCalls).not.toContain('[SUCCESS]');
    // O, de forma más estricta, verificando que solo se haya escrito el mensaje de warning
    // (esto ya lo hace expect(mockWrite).toHaveBeenCalledTimes(1); arriba)
    // y que el contenido sea el correcto:
    expect(call).toMatch(/.*?\[WARNING\].*?msg warning\n$/); // Repetido para claridad
  });

  it('debería limpiar la pantalla con la secuencia correcta', async () => {
    mockWrite.mockClear();

    const { clear } = await import('../src/logger');

    clear();

    expect(mockWrite).toHaveBeenCalledWith('\x1b[H\x1b[2J\x1b[3J');
  });

  it('debería tener prioridades correctas', async () => {
    const { levelPriority } = await import('../src/logger');

    expect(levelPriority.silly).toBeLessThan(levelPriority.debug);
    expect(levelPriority.debug).toBe(levelPriority.success);
    expect(levelPriority.info).toBeLessThan(levelPriority.warning);
    expect(levelPriority.warning).toBeLessThan(levelPriority.error);
  });
});
