import {
  HttpStatus,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserSchemaClass } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly model: Model<UserSchemaClass>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserSchemaClass> {
    try {
      this.logger.log(`Creating user ${dto.email}`);
      this.logger.debug('Generating salt and hashing password');
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
      this.logger.debug('Checking if user already exists');
      const user = await this.model.findOne({
        email: dto.email,
      });
      if (user) {
        this.logger.error('Email already exists');
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
      this.logger.debug('Creating user');
      const data = new this.model({
        email: dto.email,
        name: dto.name,
        password: dto.password,
      });
      return await data.save();
    } catch (error) {
      this.logger.error(error.message);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: error.message,
        },
      });
    }
  }

  async findByEmail(email: string): Promise<UserSchemaClass> {
    try {
      this.logger.log(`Finding user by email ${email}`);
      return await this.model.findOne({
        email,
      });
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

  async findById(id: string): Promise<UserSchemaClass> {
    try {
      this.logger.log(`Finding user by id ${id}`);
      return await this.model.findById(id).select('-password');
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
