import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';
import { Session } from '../../domain/session';
import { NullableType } from 'src/util/types/nullable.type';

export abstract class SessionRepository {
  abstract findById(_id: Session['_id']): Promise<NullableType<Session>>;

  abstract create(
    data: Omit<Session, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session>;

  abstract update(
    id: Session['_id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null>;

  abstract deleteById(_id: Session['_id']): Promise<void>;

  abstract deleteByUserId(conditions: { userId: User['_id'] }): Promise<void>;

  abstract deleteByUserIdWithExclude(conditions: {
    userId: User['_id'];
    excludeSessionId: Session['_id'];
  }): Promise<void>;
}
