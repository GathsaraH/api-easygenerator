import {
  Controller,
  Post,
  Body,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags,ApiOkResponse,ApiBearerAuth } from '@nestjs/swagger';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { NullableType } from 'src/util/types/nullable.type';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new SanitizeMongooseModelInterceptor())
  public login(@Body() loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    return this.authService.validateLogin(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() dto: AuthRegisterLoginDto): Promise<void> {
    return this.authService.register(dto);
  }

  @ApiBearerAuth("JWT-auth")
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  public me(@Request() request): Promise<NullableType<User>> {
    return this.authService.me(request.user);
  }

  @ApiBearerAuth("JWT-auth")
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<RefreshResponseDto> {
    return this.authService.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }


}
