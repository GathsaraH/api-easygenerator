import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../util/document-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export type AuthSchemaDocument = HydratedDocument<AuthSchemaClass>;

@Schema({ timestamps: true, autoCreate: true })
export class AuthSchemaClass extends EntityDocumentHelper {
  @ApiResponseProperty({
    type: String,
    example: 'John',
  })
  @Prop({
    type: String,
  })
  firstName: string;

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
  password?: string;
  @ApiResponseProperty()
  @Prop({ default: now })
  updatedAt: Date;

  @ApiResponseProperty()
  @Prop()
  deletedAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(AuthSchemaClass);
