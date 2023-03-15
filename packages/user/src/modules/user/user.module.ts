import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv'
dotenv.config({debug:true})
@Module({
  imports: [
    MongooseModule.forFeature([{name:"ToDoUser",schema:UserSchema}]),
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
         uri: config.get<string>('MONGO_DB_TODO_USER_URL'),
        }),
        inject: [ConfigService],
      }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
