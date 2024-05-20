import winston from 'winston';

export type GenericOptions = {
  projectPath?: string;
  logger: winston.Logger;
};
