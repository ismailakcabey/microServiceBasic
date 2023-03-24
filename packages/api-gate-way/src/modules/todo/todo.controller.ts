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
        @Req() req: Request,
        @Query() todo: ToDoDto
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        return await this.todoService.listTodo(todo)
    }

    @Get(':id')
    async getTodoById(
        @Param('id') id: string,
        @Req() req: Request
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        return await this.todoService.getTodoById(id);

    }

    @Patch(':id')
    async updateTodoById(
        @Req() req: Request,
        @Body() todo:ToDoDto,
        @Param('id') id:string
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        todo.updatedAt = new Date
        return await this.todoService.updateTodoById(id, todo)
    }

    @Delete(':id')
    async deleteTodoById(
        @Req() req: Request,
        @Param('id') id:string
    ){
        const auth = await this.userService.authControl(req);
        if(!(auth.status)){
            throw new UnauthorizedException();
        }
        return await this.todoService.deleteTodoById(id)
    }
}