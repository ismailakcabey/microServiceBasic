import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from './user.service';
const amqp = require("amqplib")

@Injectable()
export class UserRabbitCron {
    constructor(
        private userService: UserService,
    ){}
  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost:5672")
        const channel = await connection.createChannel()
        const assertion = await channel.assertQueue("jobsQue")
        channel.consume("jobsQue",message=>{
            channel.ack(message)
            const user = JSON.parse(message.content.toString())
            console.log(user)
            if(user){
                const mail = this.userService.sendUserVerifyMail(user)
            }
        })
    } catch (error) {
        console.log("error: " + error)
    }
  }
}