import { setDeserializeUser } from './deserializeUser/deserializeUser.js';
import { setSerializeUser } from './serializeUser/serializeUser.js';
import { usePassportSession } from './usePassportSession/usePassportSession.js';
import { useJWTStrategy } from './useStrategy/useJWTStrategy/useJWTStrategy.js';
import { useLocalStrategy } from './useStrategy/useLocalStrategy/useLocalStrategy.js';

export const usePassport = () => {
  usePassportSession();
  setSerializeUser();
  setDeserializeUser();
  useLocalStrategy();
  useJWTStrategy();
};
