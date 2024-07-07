import { ApiResponseProperty } from '@nestjs/swagger';
import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';

export class LoginResponseDto {
  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty()
  refreshToken: string;

  @ApiResponseProperty()
  tokenExpires: number;

  @ApiResponseProperty({
    type: () => User,
  })
  user: User;
}
