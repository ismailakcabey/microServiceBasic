import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name:'TODO_SERVICE',
        transport: Transport.TCP,
        options:{
          host:'127.0.0.1',
          port:3002
        }
      },
      {
        name: 'QUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'messages_que',
          queueOptions: {
            durable: false
          },
        },
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
