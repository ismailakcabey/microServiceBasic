import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly clientServiceUser: ClientProxy,
    @Inject('TODO_SERVICE') private readonly clientServiceToDo: ClientProxy,
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  pingUserService(){
    const pattern = { cmd: 'ping'}
    const payload = {}
    return this.clientServiceUser.send(pattern,payload)
  }

  pingToDoService(){
    const pattern = { cmd: 'ping'}
    const payload = {}
    return this.clientServiceToDo.send(pattern,payload)
  }

}
