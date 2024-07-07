import { Session } from '../../../session/domain/session';

export type JwtRefreshPayloadType = {
  sessionId: Session['_id'];
  hash: Session['hash'];
  iat: number;
  exp: number;
};
