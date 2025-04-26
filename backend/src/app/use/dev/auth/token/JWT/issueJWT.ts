import jwt from 'jsonwebtoken';
import fs from 'fs';
import { __pathToKeyFolder } from '../../passport/useStrategy/useJWTStrategy/keypair/generateKeypair.js';
import path from 'path';

const pathToPrivKey = path.join(__pathToKeyFolder, 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');

//jwt.verify(signedJWT, PUB_KEY, { algorithms: ['RS256'] }, (err, payload) => {});

//for postgresDB
export const getAccessToken = (id:number) => {
  const _id = id;

  const accessExpiresIn = '30m';

  const accessPayload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  };

  const accessToken = jwt.sign(accessPayload, PRIV_KEY, {
    expiresIn: accessExpiresIn,
    algorithm: 'RS256',
  });
  return {
    token: 'Bearer ' + accessToken,
  };
};

export const getRefreshToken = (id:number) => {
  const _id = id;

  const refreshExpiresIn = '2d';

  const refreshPayload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  };
  const refreshToken = jwt.sign(refreshPayload, PRIV_KEY, {
    expiresIn: refreshExpiresIn,
    algorithm: 'RS256',
  });
  return {
    token: 'Bearer ' + refreshToken,
  };
};

export const issueJWTPG = (id:number) => {
  const _id = id;

  const accessExpiresIn = '60m';

  const accessPayload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  };

  const accessToken = jwt.sign(accessPayload, PRIV_KEY, {
    expiresIn: accessExpiresIn,
    algorithm: 'RS256',
  });

  const refreshExpiresIn = '1d';

  const refreshPayload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  };

  const refreshToken = jwt.sign(refreshPayload, PRIV_KEY, {
    expiresIn: refreshExpiresIn,
    algorithm: 'RS256',
  });

  return {
    refreshToken: {
      token: 'Bearer ' + refreshToken,
      expires: refreshExpiresIn,
    },
    accessToken: {
      token: 'Bearer ' + accessToken,
      expires: accessExpiresIn,
    },
  };
};
