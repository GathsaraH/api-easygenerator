import { Session } from '../../../session/domain/session';
import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';

export type JwtPayloadType = Pick<User, 'id'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
