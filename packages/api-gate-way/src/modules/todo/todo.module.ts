import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        UserModule,
        ClientsModule.register([
            {
                name: 'TODO_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '127.0.0.1',
                    port: 3002
                }
            },
        ]),
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '1d' }
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [
        TodoController
    ],
    providers: [
        TodoService
    ]
})

export class ToDoModule {

}