import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCmd } from './user.cmd.enum';
import { UserDto, UserExcelDto, UserLoginDto } from './user.dto';
import { UserExcel } from './user.model';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @MessagePattern({cmd : UserCmd.CREATE_USER})
  async addUser(request:UserDto){
    return await this.userService.addUser(request)
  }

  @MessagePattern({cmd : UserCmd.LIST_USER})
  async listUser(request: any){
    return await this.userService.listUser(request)
  }

  @MessagePattern({ cmd: UserCmd.GET_USER_BY_ID})
  async getUserById(request: string){
    return await this.userService.getUserById(request)
  }

  @MessagePattern({ cmd: UserCmd.UPDATE_USER_BY_ID})
  async updateUserById(request: UserDto){
    return await this.userService.updateUserById(request)
  }

  @MessagePattern({ cmd: UserCmd.DELETE_USER_BY_ID})
  async deleteUserById(request: string){
    return await this.userService.deleteUserById(request)
  }

  @MessagePattern({ cmd: UserCmd.LOGIN_USER_CONTROL_EMAIL})
  async emailUserControl(request: UserLoginDto){
    return await this.userService.login(request)
  }

  @MessagePattern({ cmd : UserCmd.GET_USER_EXCEL})
  async getUserExcel(request: UserExcelDto){
    return await this.userService.getUserExcel(request)
  }

  @MessagePattern({cmd : 'ping'})
  async pingUser(){
    return await this.userService.pongUser()
  }
}
