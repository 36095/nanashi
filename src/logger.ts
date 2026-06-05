import type { LogLevel, LogType } from './types';
import { DateHandler } from './DateHandler';

// Nivel de logging configurable
export let logLevel: LogLevel = 'info';
// Mapear niveles para la comparación
export const levelPriority: Record<LogLevel, number> = {
  silly: 0,
  debug: 1,
  success: 1,
  info: 2,
  warning: 3,
  error: 4,
};

export const colors: Record<LogType, string> = {
  debug: '\x1b[1;36m', // Cyan
  info: '\x1b[1;37m', // Blanco
  silly: '\x1b[1;35m', // Magenta (supongo que era el plan, no Blanco)
  success: '\x1b[1;32m', // Verde
  warning: '\x1b[1;33m', // Amarillo
  error: '\x1b[1;31m', // Rojo
  reset: '\x1b[0;22;23;24;25;27;28;29m',
  simple_reset: '\x1b[0;22m',
  dim_white: '\x1b[2m',
};

// Función de logging con colores
export default function logger(
  level: LogLevel = 'silly',
  message: string
): void {
  // Asegurarnos de no mostrar mensajes de debug en prod.
  if (!process.env.NODE_ENV?.toLowerCase().startsWith('dev')) {
    logLevel = 'warning';
  }

  // Solo mostrar mensajes si el nivel actual permite ese tipo de mensaje
  if (levelPriority[level] < levelPriority[logLevel]) {
    return;
  }

  const color = colors[level];
  const levelStr = `${color}[${level.toUpperCase()}]${colors.simple_reset}`;

  const timeString =
    `${colors.dim_white}${levelPriority[logLevel] <= 1 ? DateHandler.formatted_with_milliseconds : DateHandler.formatted}` +
    colors.reset;

  process.stdout.write(`${timeString} ${levelStr.padEnd(23)} ${message}\n`); // Añadí \n para salto de línea
}

export function clear() {
  process.stdout.write('\x1b[H\x1b[2J\x1b[3J');
}

export { logger };
