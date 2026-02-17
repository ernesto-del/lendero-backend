// LENDERO HUACHI - Logger Configuration
// Winston logger para logging estructurado

import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato personalizado
const customFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  return msg;
});

// Crear logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: combine(
        colorize(),
        customFormat
      ),
    }),
    
    // File para errores
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    
    // File para todo
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Si no estamos en producción, loggear también a consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      customFormat
    ),
  }));
}

export default logger;
