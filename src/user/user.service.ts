import { Injectable } from '@nestjs/common';
import { UserSchemaClass } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserSchemaClass.name)
        private readonly model: Model<UserSchemaClass>,
    ){}
}
