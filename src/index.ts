import { DateHandler } from './classes/DateHandler';
import Logger, {
  clear,
  colors,
  fatal,
  levelPriority,
  logLevel,
  logger,
} from './classes/Logger';
import { RelativeDate } from './classes/RelativeDate';

import type { LogLevel, LogType } from './types';

export type { LogLevel, LogType };

export {
  Logger,
  RelativeDate,
  clear,
  clear as cls,
  colors,
  fatal,
  levelPriority,
  logger as log,
  logLevel,
  logger,
};
export { DateHandler };
