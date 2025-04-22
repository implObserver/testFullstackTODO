import 'dotenv/config';

export const defaultConfig = {
  port: process.env.PORT || '10000',
  host: process.env.HOST || '0.0.0.0',
};
