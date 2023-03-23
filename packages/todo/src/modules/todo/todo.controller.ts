import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ToDoCmd } from './todo.cmd.enum'
import { ToDoDto } from './todo.dto'
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
    
}