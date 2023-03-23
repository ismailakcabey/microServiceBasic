import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    Req,
    UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ToDoDto } from './todo.dto'
import { Request } from 'express'
import { TodoService } from './todo.service'
import { UserService } from '../user/user.service'

@Controller('todo')
export class TodoController{
    constructor(
        private readonly jwtService: JwtService,
        private readonly todoService: TodoService,
        private readonly userService: UserService
    ){}

    @Post()
    async addTodo(
        @Req() req: Request,
        @Body() todo:ToDoDto
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        const user = await this.jwtService.verifyAsync(req.headers.authorization)
        todo.userId = user.id;
        return await this.todoService.addTodo(todo)
    }

    @Get()
    async listTodo(
        @Req() req: Request
    ){

    }

    @Get('/excel')
    async getTodoExcel(){

    }

    @Get(':id')
    async getTodoById(
        @Param('id') id: string,
        @Req() req: Request
    ){

    }

    @Patch(':id')
    async updateTodoById(
        @Req() req: Request
    ){

    }

    @Delete(':id')
    async deleteTodoById(
        @Req() req: Request
    ){

    }
}