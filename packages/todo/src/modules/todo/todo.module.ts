import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ToDoSchema } from './todo.model';
import { ToDoController } from './todo.controller';
import { TodoService } from './todo.service';
dotenv.config({debug:true})

@Module({
    imports:[
        MongooseModule.forFeature([{name:"ToDoToDo",schema:ToDoSchema}]),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
             uri: config.get<string>('MONGO_DB_TODO_TODO_URL'),
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
    controllers:[
        ToDoController
    ],
    providers:[
        TodoService
    ],
})

export class ToDoModule{}