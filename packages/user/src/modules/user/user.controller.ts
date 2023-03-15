import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCmd } from './user.cmd.enum';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @MessagePattern({cmd : UserCmd.CREATE_USER})
  addUser(request:UserDto){
    return this.userService.addUser(request)
  }

  @MessagePattern({cmd : UserCmd.LIST_USER})
  listUser(request: any){
    return this.userService.listUser(request)
  }

  @MessagePattern({cmd : 'ping'})
  pingUser(){
    return this.userService.pongUser()
  }
}
