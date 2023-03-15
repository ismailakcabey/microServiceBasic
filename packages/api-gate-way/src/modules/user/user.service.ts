import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "./user.dto";

@Injectable()
export class UserService{
    constructor(
        @Inject('USER_SERVICE') private readonly clientServiceUser:ClientProxy
    ){}
    async addUser(user:UserDto){
        try {
            const pattern = { cmd : 'create_user'}
            const payload = user
            const response = this.clientServiceUser.send(pattern,payload)
            return response
        } catch (error) {
            return {
                status:false,
                message:error.message
            }
        }
    }

    async listUser(user:UserDto){
        try {
            const pattern = { cmd : 'list_user'}
            const payload = user
            const response = this.clientServiceUser.send(pattern,payload)
            return response
        } catch (error) {
            return {
                status:false,
                message:error.message
            }
        }
    }
}