import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { async } from 'rxjs';
import { AppService } from './app.service';
import * as dotenv from 'dotenv'
const Mailjet = require('node-mailjet');
import { User } from './user.model';
dotenv.config()
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

  @MessagePattern({cmd:'message_printed'})
  async handleMessagePrinted(request:any) {
    console.log("que'de")
    await this.delay(5000);
    console.log(request)
  }

  @MessagePattern( {cmd:'user_verify_mail'})
  async verifyMail(user:User){
    dotenv.config({debug: true});
    const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
apiKey: process.env.MAIL_JET_API_KEY,
apiSecret: process.env.MAIL_JET_API_SECRET_KEY
});
console.log("servis içi bekliyor servise gel")
await this.delay(30000);
console.log("servis bitti 30sn")
const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_JET_SEND_EMAIL,
            Name: "ToDo App"
          },
          To: [
            {
              Email: user.email,
              Name: user.fullName
            }
          ],
          Subject: "Email Doğrulama",
          TextPart: "Mailde doğrulama maili",
        }
      ]
    })
request
.then((result) => {
})
.catch((err) => {
    console.log(err.statusCode)

})
return "success"
  }


}
