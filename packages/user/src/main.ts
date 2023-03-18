import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger

async function bootstrap(){
  const app = await NestFactory.createMicroservice(AppModule,{
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port:3001
    },
  })
  await app.listen().then(()=>{
    logger.log('MicroService User Listening')
  }).catch((err) => {
    logger.error(err)
  })
}

bootstrap()