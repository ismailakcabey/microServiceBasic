import { Body, Controller, Post, Get, Query } from "@nestjs/common";
import { UserDto } from "./user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(
        private readonly userService:UserService
    ){}

    @Post()
    async addUser(
        @Body() user: UserDto
    ){
        return this.userService.addUser(user)
    }

    @Get()
    async listUser(
        @Query() user: UserDto
    ){
        return this.userService.listUser(user)
    }
}