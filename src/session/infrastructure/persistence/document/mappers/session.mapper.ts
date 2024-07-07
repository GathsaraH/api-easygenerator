
import { UserSchemaClass } from 'src/user/schemas/user.schemas';
import { Session } from '../../../../domain/session';
import { SessionSchemaClass } from '../schema/session.schema';

export class SessionMapper {
  static toDomain(raw: SessionSchemaClass): Session {
    const session = new Session();
    session._id = raw._id.toString();

    if (raw.user) {
      session.user = raw.user
    }

    session.hash = raw.hash;
    session.createdAt = raw.createdAt;
    session.updatedAt = raw.updatedAt;
    session.deletedAt = raw.deletedAt;
    return session;
  }
  static toPersistence(session: Session): SessionSchemaClass {
    const user = new UserSchemaClass();
    user._id = session.user._id.toString();
    const sessionEntity = new SessionSchemaClass();
    if (session._id && typeof session._id === 'string') {
      sessionEntity._id = session._id;
    }
    sessionEntity.user = user;
    sessionEntity.hash = session.hash;
    sessionEntity.createdAt = session.createdAt;
    sessionEntity.updatedAt = session.updatedAt;
    sessionEntity.deletedAt = session.deletedAt;
    return sessionEntity;
  }
}
