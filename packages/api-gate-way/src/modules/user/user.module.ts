import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { Module } from '@nestjs/common';
import { Client } from '@nestjs/microservices/external/nats-client.interface';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports:[
        ClientsModule.register([
            {
                name:'USER_SERVICE',
                transport: Transport.TCP,
                options:{
                  host:'127.0.0.1',
                  port:3001
                }
              },
        ]),
        JwtModule.register({
            secret: 'secret',
            signOptions: {expiresIn: '1d'}
        }),
        ConfigModule.forRoot({
            isGlobal: true,
          }),
    ],
    controllers:[
        UserController
    ],
    providers:[
        UserService
    ],
    exports:[
        UserService
    ]
})

export class UserModule{

}