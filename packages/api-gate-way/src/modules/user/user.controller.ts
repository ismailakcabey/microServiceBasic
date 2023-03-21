import { Body, Controller, Post, Get, Query, Param, Patch, Delete, Req, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto, UserLoginDto } from "./user.dto";
import { UserService } from "./user.service";
import {Response, Request, response} from 'express';

@Controller('user')
export class UserController{
    constructor(
        private readonly userService:UserService,
        private jwtService: JwtService,
    ){}

    @Post()
    async addUser(
        @Body() user: UserDto
    ){
        return await this.userService.addUser(user)
    }

    @Get()
    async listUser(
        @Query() user: UserDto,
        @Req() req: Request
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        return await this.userService.listUser(user)
    }


    @Get('/excel')
    async getUserExcel(
        @Query() user: UserDto,
        @Req() req: Request
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        const data = await this.jwtService.verifyAsync(req.headers.authorization);
        return await this.userService.getUserExcel(user,data.id)
    }

    @Get(':id')
    async getUserById(
        @Param('id')id: string,
        @Req() req: Request
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        return await this.userService.getUserById(id)
    }

    @Patch(':id')
    async updateUserById(
        @Param('id')id: string,
        @Body()user: UserDto,
        @Req() req: Request
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        return await this.userService.updateUserById(id,user)
    }

    @Delete(':id')
    async deleteUserById(
        @Param('id')id: string,
        @Req() req: Request
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        return await this.userService.deleteUserById(id)
    }

    @Post('/login')
    async login(
        @Body()user: UserLoginDto,
        @Req() req: Request
    ){
        return await this.userService.login(user)
    }
}