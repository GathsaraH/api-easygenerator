import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';
import { Session } from '../../domain/session';
import { NullableType } from 'src/util/types/nullable.type';

export abstract class SessionRepository {
  abstract findById(id: Session['id']): Promise<NullableType<Session>>;

  abstract create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session>;

  abstract update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null>;

  abstract deleteById(id: Session['id']): Promise<void>;

  abstract deleteByUserId(conditions: { userId: User['_id'] }): Promise<void>;

  abstract deleteByUserIdWithExclude(conditions: {
    userId: User['_id'];
    excludeSessionId: Session['id'];
  }): Promise<void>;
}
