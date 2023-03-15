import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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

}
