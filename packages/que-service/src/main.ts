import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger

async function bootstrap(){
  const app = await NestFactory.createMicroservice(AppModule,{
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5672'],
      queue: 'rabbit-que',
      queueOptions: {
        durable: false
      },
      reconnectTime: 5000
    },

  })
  await app.listen().then(()=>{
    logger.log('MicroService Que Listening')
  }).catch((err) => {
    logger.error(err)
  })
}

bootstrap()