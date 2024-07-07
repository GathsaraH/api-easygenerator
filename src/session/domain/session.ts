import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';


export class Session {
  id: number | string;
  user: User;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
