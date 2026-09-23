import type { LogLevel, LogType } from '../types';
import { DateHandler } from './DateHandler';

// Nivel de logging configurable
export let logLevel: LogLevel = 'info';

export const levelPriority: Record<LogLevel, number> = {
  silly: 0,
  debug: 1,
  success: 1,
  info: 2,
  warning: 3,
  error: 4,
};

export const colors: Record<LogType, string> = {
  debug: '\x1b[1;36m', // Cyan #0ff
  info: '\x1b[1;37m', // White #fff
  silly: '\x1b[1;35m', // Magenta #f0f
  success: '\x1b[1;32m', // Green #0f0
  warning: '\x1b[1;33m', // Yellow #ff0
  error: '\x1b[1;31m', // Red #f00
  reset: '\x1b[0;22;23;24;25;27;28;29m',
  simple_reset: '\x1b[0;22m',
  dim_white: '\x1b[2m', // Dim White #ddd
};

// Registro para asegurar que cada aviso se muestre solo una vez
const warnedMessages = new Set<string>();

function deprecation_warning(func: string, alt: string): void {
  if (!warnedMessages.has(func)) {
    process.stdout.write(
      `${colors.warning}Deprecation Warning:${colors.reset} ${colors.dim_white}The ${func}() function is deprecated and will be removed in a future version, please use ${alt}() instead.${colors.reset}\n`
    );
    warnedMessages.add(func);
  }
}

export default class Logger {
  /**
   * @param level LogLevel to output
   * @param message Message to output
   * @returns {void} void
   */
  public static log(level: LogLevel = 'silly', message: string): void {
    // Nota: En tu código original, `logLevel = 'silly'` sobrescribe incondicionalmente
    // la asignación anterior. Asegúrate de que este sea el comportamiento deseado.
    if (!process.env.NODE_ENV?.toLowerCase().startsWith('dev')) {
      logLevel = 'warning';
    }
    // logLevel = 'silly';

    if (levelPriority[level] < levelPriority[logLevel]) {
      return;
    }

    const _color = colors[level];
    const _levelStr = `${_color}[${level.toUpperCase()}]${colors.simple_reset}`;
    const _timeString =
      `${colors.dim_white}${levelPriority[logLevel] <= 1 ? DateHandler.formatted_with_milliseconds : DateHandler.formatted}` +
      colors.reset;

    process.stdout.write(`${_timeString} ${_levelStr.padEnd(23)} ${message}\n`);
  }

  /**
   * Clear the screen
   * @returns {void} void
   */
  public static clear(): void {
    process.stdout.write('\x1b[H\x1b[2J\x1b[3J');
    process.stdout.write(`${colors.dim_white}Console cleared${colors.reset}\n`);
  }

  /**
   * Prints the provided `message` to stderr and exits the process
   * @param message Message to print
   * @param error Optional error to print
   * @returns {never}
   */
  public static fatal(
    message: string,
    error?: Error | string | undefined
  ): never {
    if (error) {
      Logger.log('error', `[Fatal]: ${message} \n ${error}\n`);
      process.stderr.write(`[Fatal]: ${message} \n${error}\n`);
    } else {
      Logger.log('error', `[Fatal]: ${message}\n`);
      process.stderr.write(`[Fatal]: ${message} \n`);
    }
    process.exit(1);
  }
}

/**
 * @deprecated Use {@link Logger.log} instead
 */
export function log(level: LogLevel = 'silly', message: string): void {
  deprecation_warning('log', 'Logger.log()');
  Logger.log(level, message);
}

/**
 * Clear the screen
 * @deprecated Use {@link Logger.clear} instead
 */
export function clear(): void {
  Logger.clear();
  deprecation_warning('clear', 'Logger.clear');
}

/**
 * Prints the provided `message` to stderr and exits the process
 * @deprecated Use {@link Logger.fatal} instead
 */
export function fatal(
  message: string,
  error?: Error | string | undefined
): never {
  deprecation_warning('fatal', 'Logger.fatal');
  Logger.fatal(message, error);
}
// clear();
// log('info', 'hello');
// log('info', 'hello');
// log('info', 'hello');
// fatal('fatal');

export { log as logger };
