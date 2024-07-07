import { Injectable } from '@nestjs/common';

import { SessionRepository } from './infrastructure/persistence/session.repository';
import { Session } from './domain/session';
import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';
import { NullableType } from 'src/util/types/nullable.type';


@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findById(_id: Session['_id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findById(_id);
  }

  create(
    data: Omit<Session, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  update(
    id: Session['_id'],
    payload: Partial<
      Omit<Session, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload);
  }

  deleteById(_id: Session['_id']): Promise<void> {
    return this.sessionRepository.deleteById(_id);
  }

  deleteByUserId(conditions: { userId: User['_id'] }): Promise<void> {
    return this.sessionRepository.deleteByUserId(conditions);
  }

  deleteByUserIdWithExclude(conditions: {
    userId: User['_id'];
    excludeSessionId: Session['_id'];
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions);
  }
}
