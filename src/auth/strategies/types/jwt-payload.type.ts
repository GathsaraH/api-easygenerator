import { Session } from '../../../session/domain/session';
import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';

export type JwtPayloadType = Pick<User, '_id'> & {
  sessionId: Session['_id'];
  iat: number;
  exp: number;
};
