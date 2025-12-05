import { Module } from '@nestjs/common';
import { UsersController } from './Users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users } from './schema/users.schema';
import { UsersSchema } from './schema/users.schema';
import { UsersRepository } from './repository/users.repository';
import { BcryptHelper } from './helpers/bcrypt.helper';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository,BcryptHelper]
})
export class UsersModule {}
