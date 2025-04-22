import { useCookieParser } from './cookie/useCookieParser.js';
import { useJSONParser } from './json/useJSONparser.js';
import { useURLParser } from './url/useURLparser.js';

export const useRequestParsersMiddleware = () => {
  useJSONParser();
  useURLParser();
  useCookieParser();
};
