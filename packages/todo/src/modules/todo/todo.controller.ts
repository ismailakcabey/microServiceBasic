import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ToDoCmd } from './todo.cmd.enum'
import { ToDoDto, ToDoUpdateDto } from './todo.dto'
import { TodoService } from './todo.service'

@Controller()
export class ToDoController {
    constructor(
        private readonly todoService: TodoService
    ){

    }

    @MessagePattern({cmd:ToDoCmd.CREATE_TODO})
    async addTdo(request:ToDoDto){
        return await this.todoService.addToDo(request)
    }
    
    @MessagePattern({cmd:ToDoCmd.LIST_TODO})
    async listTodo(request:ToDoDto){
        return await this.todoService.listTodo(request)
    }

    @MessagePattern({cmd:ToDoCmd.TODO_BY_ID})
    async getTodoById(request:string){
        return await this.todoService.getTodoById(request)
    }

    @MessagePattern({cmd:ToDoCmd.UPDATE_TODO})
    async updateTodo(request:ToDoUpdateDto){
            const response = await this.todoService.updateTodoById(request)
            return response
    }

    @MessagePattern({cmd:ToDoCmd.DELETE_TODO})
    async deleteTodo(request:string){
        const response = await this.todoService.deleteTodoById(request)
        return  response
    }
}