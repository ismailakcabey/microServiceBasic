import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('QUE_SERVICE') private readonly client: ClientProxy,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('todo')
  toDoServicePing(){
    return this.appService.pingToDoService();
  }

  @Get('/que')
  queServicePing() {
    const message = ':cat:';
const record = new RmqRecordBuilder(message)
  .setOptions({
    headers: {
      ['x-version']: '1.0.0',
    },
    priority: 3,
  })
  .build();

this.client.send('replace-emoji', record).subscribe()
  }

  @Get('/quesam')
  async queSam(){
    const a = 2;
  const b = 3;
    console.log("servis içi")
  const result = this.client.send<number, number[]>({ cmd: 'add' }, [a, b]).toPromise();
  console.log("servis geldi")
  console.log(`servis içi yanıt geldi cevap verme saati: ${new Date}`)
  console.log(`The result of ${a} + ${b} is ${result.result}`);
  return result
  }

}
