import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SessionService } from 'src/session/session.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/app-config/config.type';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';
import * as crypto from 'crypto';
import { Session } from 'src/session/domain/session';
import ms from 'ms';
import { UserSchemaClass as User } from 'src/user/schemas/user.schemas';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { NullableType } from 'src/util/types/nullable.type';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private sessionService: SessionService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    try {
      this.logger.log(`Validating user ${loginDto.email}`);
      const user = await this.userService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        });
      }

      const isValidPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        });
      }
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');

      const session = await this.sessionService.create({
        user,
        hash,
      });

      const { token, refreshToken, tokenExpiresIn } = await this.getTokensData({
        id: user._id,
        sessionId: session._id,
        hash,
      });
      return {
        refreshToken,
        token,
        tokenExpires: Number(tokenExpiresIn),
        user,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          email: error.message,
        },
      });
    }
  }
  async register(dto: AuthRegisterLoginDto) {
    try {
      this.logger.log(`Registering user ${dto.email}`);
      const user = await this.userService.createUser(dto);
      await this.jwtService.signAsync(
        {
          confirmEmailUserId: user._id,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.expires', {
            infer: true,
          }),
        },
      );
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          email: error.message,
        },
      });
    }
  }
  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    try {
      this.logger.log(`Refreshing token for session ${data.sessionId}`);
      const session = await this.sessionService.findById(data.sessionId);

      if (!session) {
        throw new UnauthorizedException();
      }

      if (session.hash !== data.hash) {
        throw new UnauthorizedException();
      }

      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');
      this.logger.log(`User ${session.user._id} refreshed token`);
      const user = await this.userService.findById(session.user._id);
      this.logger.log(`User ${session.user._id} found`);
      if (!user) {
        throw new UnauthorizedException();
      }
      this.logger.debug(`Updating session ${session._id} with new hash ${hash}`);
      await this.sessionService.update(session._id, {
        hash,
      });

      const { token, refreshToken, tokenExpiresIn } = await this.getTokensData({
        id: session.user._id,
        sessionId: session._id,
        hash,
      });

      return {
        token,
        refreshToken,
        tokenExpires: Number(tokenExpiresIn),
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          email: error.message,
        },
      });
    }
  }
  private async getTokensData(data: {
    id: User['_id'];
    sessionId: Session['_id'];
    hash: Session['hash'];
  }) {
    try {
      this.logger.log(`Generating tokens for user ${data.id}`);
      const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
        infer: true,
      });
      this.logger.log(`Token expires in ${tokenExpiresIn}`);
      const tokenExpires = Date.now() + ms(tokenExpiresIn);
      const [token, refreshToken] = await Promise.all([
        await this.jwtService.signAsync(
          {
            _id: data.id,
            sessionId: data.sessionId,
          },
          {
            secret: this.configService.getOrThrow('auth.secret', {
              infer: true,
            }),
            expiresIn: tokenExpiresIn,
          },
        ),
        await this.jwtService.signAsync(
          {
            sessionId: data.sessionId,
            hash: data.hash,
          },
          {
            secret: this.configService.getOrThrow('auth.refreshSecret', {
              infer: true,
            }),
            expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
              infer: true,
            }),
          },
        ),
      ]);

      return {
        token,
        refreshToken,
        tokenExpiresIn,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw new UnprocessableEntityException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          email: error.message,
        },
      });
    }
  }
  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    try {
      this.logger.log(`Finding user by id ${userJwtPayload._id}`);
      return await this.userService.findById(userJwtPayload._id);
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          id: error.message,
        },
      });
    }
  }
}
