import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../util/document-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({ timestamps: true, autoCreate: true })
export class UserSchemaClass extends EntityDocumentHelper {
  @ApiResponseProperty({
    type: String,
  })
  id: string;
  @ApiResponseProperty({
    type: String,
    example: 'John',
  })
  @Prop({
    type: String,
  })
  name: string;
  @ApiResponseProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  email: string;
  @Exclude({ toPlainOnly: true })
  @Prop()
  password: string;
  @ApiResponseProperty()
  @Prop({ default: now })
  updatedAt: Date;

  @ApiResponseProperty()
  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
