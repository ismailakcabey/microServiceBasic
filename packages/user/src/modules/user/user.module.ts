import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { JwtModule } from '@nestjs/jwt';
import {AmqpModule} from 'nestjs-amqp';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserRabbitCron } from './user.rabbitConsumer.cron';
import { ScheduleModule } from '@nestjs/schedule';
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
      JwtModule.register({
        secret: 'secret',
        signOptions: {expiresIn: '1d'}
    }),
    ConfigModule.forRoot({
        isGlobal: true,
      }),
      ScheduleModule.forRoot()
  ],
  controllers: [UserController],
  providers: [UserService,
  UserRabbitCron],
})
export class UserModule {}
