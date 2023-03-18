import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './modules/user/user.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('TODO_SERVICE') private readonly clientServiceToDo: ClientProxy,
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  pingToDoService(){
    const pattern = { cmd: 'ping'}
    const payload = {}
    return this.clientServiceToDo.send(pattern,payload)
  }

  pingQueService(){
    try {
      const pattern = { cmd: 'notifications'}
    const payload = {}
    } catch (error) {
      Logger.error(error)
      return{
        status:false,
        message:error.message
      }
    }
  }
}
