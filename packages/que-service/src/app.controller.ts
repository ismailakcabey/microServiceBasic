import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('notifications')
getNotifications(@Payload() data: number[], @Ctx() context: RmqContext) {
  const channel = context.getChannelRef();
  const originalMsg = context.getMessage();

  channel.ack(originalMsg);
}

@MessagePattern('replace-emoji')
replaceEmoji(@Payload() data: string, @Ctx() context: RmqContext): string {
  const { properties: { headers } } = context.getMessage();
  console.log("geldi")
  return headers['x-version'] === '1.0.0' ? '🐱' : '🐈';
}

async delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@MessagePattern({ cmd: 'add' })
  async accumulate(@Payload() data: number[]) {
    console.log("que içi")
    const result = data.reduce((a, b) => a + b);
    console.log("que içi işlemi yaptı")
    await this.delay(5000);
    console.log(`que içi işlemi yaptı cevap verme saati: ${new Date}`)
    return { result };
  }



}
