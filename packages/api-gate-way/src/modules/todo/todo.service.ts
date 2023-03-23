import { Injectable , Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ToDoDto } from "./todo.dto";

@Injectable()
export class TodoService {
    constructor(
        @Inject('TODO_SERVICE') private readonly clientServiceTodo:ClientProxy,
    ){}

    async addTodo(todo:ToDoDto){
        try {
            const pattern = { cmd: 'create_todo' }
            const payload = todo
            const response = await this.clientServiceTodo.send(pattern, payload).toPromise()
            return response
        } catch (error) {
            return{
                status:false,
                message:error.message
            }
        }
    }
}