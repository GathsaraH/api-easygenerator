import { Injectable } from '@nestjs/common';
import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';
import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';
import { SessionSchemaClass } from '../schema/session.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SessionMapper } from '../mappers/session.mapper';
import { NullableType } from 'src/util/types/nullable.type';

@Injectable()
export class SessionDocumentRepository implements SessionRepository {
  constructor(
    @InjectModel(SessionSchemaClass.name)
    private sessionModel: Model<SessionSchemaClass>,
  ) {}

  async findById(_id: Session['_id']): Promise<NullableType<Session>> {
    const sessionObject = await this.sessionModel.findById(_id);
    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    const createdSession = new this.sessionModel(persistenceModel);
    const sessionObject = await createdSession.save();
    return SessionMapper.toDomain(sessionObject);
  }

  async update(
    _id: Session['_id'],
    payload: Partial<Session>,
  ): Promise<Session | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload._id;
    delete clonedPayload.createdAt;
    delete clonedPayload.updatedAt;
    delete clonedPayload.deletedAt;

    const filter = { _id: _id.toString() };
    const session = await this.sessionModel.findOne(filter);

    if (!session) {
      return null;
    }

    const sessionObject = await this.sessionModel.findOneAndUpdate(
      filter,
      SessionMapper.toPersistence({
        ...SessionMapper.toDomain(session),
        ...clonedPayload,
      }),
      { new: true },
    );

    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async deleteById(_id: Session['_id']): Promise<void> {
    await this.sessionModel.deleteOne({ _id: _id.toString() });
  }

  async deleteByUserId({ userId }: { userId: User['_id'] }): Promise<void> {
    await this.sessionModel.deleteMany({ user: userId.toString() });
  }

  async deleteByUserIdWithExclude({
    userId,
    excludeSessionId,
  }: {
    userId: User['_id'];
    excludeSessionId: Session['_id'];
  }): Promise<void> {
    const transformedCriteria = {
      user: userId.toString(),
      _id: { $not: { $eq: excludeSessionId.toString() } },
    };
    await this.sessionModel.deleteMany(transformedCriteria);
  }
}
