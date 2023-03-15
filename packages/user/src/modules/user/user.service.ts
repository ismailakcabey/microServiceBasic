import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('ToDoUser') private readonly user: Model<User>,
    ){}
  getHello(): string {
    return 'Hello World!';
  }

  async addUser(request:UserDto){
    try {
        const addUser = new this.user(request)
    const result = await addUser.save()
    return {
        status:true,
        data:result?.id as string,
    }
    } catch (error) {
        return {
            status:false,
            data:error.message
        }  
    }
  }

  async listUser(request: UserDto){
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

  pongUser(){
    return "Pong User"
  }
}
