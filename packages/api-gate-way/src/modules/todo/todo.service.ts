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

    async listTodo(todo:ToDoDto){
        try {
            const pattern = { cmd: 'list_todo'}
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

    async getTodoById(id: string){
        try {
            const pattern = { cmd: 'todo_by_id'}
        const payload = id
        const response = await this.clientServiceTodo.send(pattern, payload).toPromise()
        return response
        } catch (error) {
            return{
                status:false,
                message:error.message
            }
        }
    }

    async deleteTodoById(id: string){
        try {
            const pattern = { cmd: 'delete_todo'}
        const payload = id
        const response = await this.clientServiceTodo.send(pattern, payload).toPromise()
        return response
        } catch (error) {
            return{
                status:false,
                message:error.message
            }
        }
    }

    async updateTodoById(id:string,todo:ToDoDto){
        try {
            const pattern = { cmd:'update_todo' }
        const payload = {
            id:id,
            data:todo
        }
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