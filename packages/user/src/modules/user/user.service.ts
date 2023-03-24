import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse, UserDto, UserExcelDto, UserLoginDto, UserUpdateDto } from './user.dto';
import { User, UserExcel } from './user.model';
const passwordHash = require('password-hash');
import * as dotenv from 'dotenv'
import { Cache } from 'cache-manager';
import * as AWS from 'aws-sdk';
import { ClientProxy } from '@nestjs/microservices';
import { UserError } from './user.error.enum';
const amqp = require("amqplib")
var fs = require('fs');
const XLSX = require('xlsx');
dotenv.config()
@Injectable()
export class UserService {
    constructor(
        @InjectModel('ToDoUser') private readonly user: Model<User>,
        @InjectModel('ToDoUser')private readonly userExcel:Model<UserExcel>,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}
  getHello(): string {
    return 'Hello World!';
  }

  async addUser(request:UserDto):Promise<IResponse>{
    try {
        const addUser = new this.user(request)
        const conrtolEmail = await this.user.findOne({ email: request.email})
        if(conrtolEmail){
          throw new Error(UserError.EMAIL_ALREADY)
        }
        addUser.password = passwordHash.generate(addUser?.password)
    const result = await addUser.save()
    this.rabbitMqQueueMailConnect(addUser)
    return {
        status:true,
        data:result,
    }
    } catch (error) {
        return {
            status:false,
            data:error.message
        }  
    }
  }


async rabbitMqQueueMailConnect(user:UserDto){
  try {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672")
  const channel = await connection.createChannel()
  const assertion = await channel.assertQueue("jobsQue")
      channel.sendToQueue("jobsQue",Buffer.from(JSON.stringify(user)))
  } catch (error) {
      console.log(error)
  }
}

   async sendUserVerifyMail(user:User){
     dotenv.config({debug: true});
     const Mailjet = require('node-mailjet');
 const mailjet = new Mailjet({
 apiKey: process.env.MAIL_JET_API_KEY,
 apiSecret: process.env.MAIL_JET_API_SECRET_KEY
 });
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
 }

  async listUser(request: UserDto):Promise<IResponse>{
    try {
        const users = await this.user.find(request)
        const count = await this.user.count(request)
    return{
        status:true,
        count:count,
        data:users
    }
    } catch (error) {
        return {
            status:false,
            data:error.message
        }  
    }
  }

  async getUserById(request:string):Promise<IResponse>{
    try {
      const user = await this.user.findById(request)
      if(!user){
        return{
          status:false,
          data:null
        }
      }
      return {
        status:true,
        data:user
      }
    } catch (error) {
      return{
        status:false,
        message:error.message
      }
    }
  }

  async updateUserById(request:UserUpdateDto):Promise<IResponse>{
    try {
      const user = await this.user.findByIdAndUpdate(request.id,request.data)
      return{
        status:true,
        data:user
      }
    } catch (error) {
      return{
        status:false,
        message:error.message
      }
    }
  }

  async deleteUserById(request:string):Promise<IResponse>{
    try {
      const user = await this.user.findByIdAndDelete(request)
      return {
        status:true,
        data:user
      }
    } catch (error) {
      return{
        status:false,
        message:error.message
      }
    }
  }

  async login(user:UserLoginDto){
    try {
      const loginUser = await this.user.findOne({email:user.email})
    if(loginUser == null || loginUser == undefined){
      return{
        status:true,
        message:'user not found'
      }
    }
    if (!passwordHash.verify(user.password, loginUser.password)) {
      throw new UnauthorizedException('password is not valid');
  }
    const jwt = await this.jwtService.signAsync({id: loginUser.id});
    return{
      status:true,
      token:jwt,
      data:loginUser
    }  
    } catch (error) {
      return{
        status:false,
        message:error.message
      }
    }  
  }

  async s3Upload(file,fileName,fileType,user:User){
    dotenv.config({debug: true});
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
    const s3 = new AWS.S3()
    
   try {
    const name =fileName
        const date = new Date
        const date2 = date.toISOString();
        const replaceDate = date2.replace(" ","+")
        await s3.putObject({
            Body:file,
            Bucket:process.env.AWS_BUCKET,
            Key:`${name}${replaceDate}.${fileType}`
        }).promise()
        const url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${name}${replaceDate}.${fileType}`
        let result = url.replace(" ", "+");
        const email = await this.sendExcelExportMail(result,user)
   } catch (error) {
    console.log(error)
   }
}

  async getUserExcel(filter: UserExcelDto):Promise<IResponse>{
    const user = await this.user.findById(filter.id)
    const controlExcel = await this.cacheManager.get(`userExcel${user.id}`)
    if(controlExcel){
      return{
        status:false,
        message:'please await because user already new excel export'
      }
    }
    const data = await this.getExcel(filter.user)
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, `users`)
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
    const buffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });
    const url = this.s3Upload(buffer,"users","xlsx",user)
    await this.cacheManager.set(`userExcel${user.id}`,true)
    return{
        status : true,
        message : "Excel file generated",
    }
}

async getExcel(filter: UserDto){
  const users = await this.userExcel.find(filter).exec();
  return users.map(
      user=> ({
          isim:user.fullName,
          email:user.email,
          dogumTarihi:user.birthDate
      })
  )
}

async sendExcelExportMail(url,user:User){
  dotenv.config({debug: true});
  const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
apiKey: process.env.MAIL_JET_API_KEY,
apiSecret: process.env.MAIL_JET_API_SECRET_KEY
});
const request = mailjet
  .post('send', { version: 'v3.1' })
  .request({
    Messages: [
      {
        From: {
          Email: process.env.MAIL_JET_SEND_EMAIL,
          Name: "ToDo APP"
        },
        To: [
          {
            Email: user.email,
            Name: user.fullName
          }
        ],
        Subject: "Excel export maili",
        TextPart:`linkte tıklayarak dosyanızı indirebilirsiniz: ${url}`,
      }
    ]
  })
request
.then((result) => {
})
.catch((err) => {
  console.log(err.statusCode)

})
}

  pongUser(){
    return "Pong User"
  }
}
