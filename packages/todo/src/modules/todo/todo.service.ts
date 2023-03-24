import { Inject , Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IResponse, ToDoDto, ToDoUpdateDto } from './todo.dto'
import { ToDo } from './todo.model'

@Injectable()
export class TodoService{
    constructor(
        @InjectModel('ToDoToDo') private readonly todo:Model<ToDo>
    ){}

    async addToDo(todo:ToDoDto):Promise<IResponse>{
        try {
            const addTodo = new this.todo(todo)
            const result = await addTodo.save()
            return{
                status:true,
                data:result
            }
        } catch (error) {
            return{
                status:false
            }
        }
    }

    async listTodo(todo:ToDoDto):Promise<IResponse>{
        try {
            const response = await this.todo.find(todo)
            const responseCount = await this.todo.count(todo)
            return{
                status:true,
                count:responseCount,
                data:response
            }
        } catch (error) {
            return {
                status:false,
                message:error.message
            }
        }
    }

    async getTodoById(id:string):Promise<IResponse>{
        try {
            const response = await this.todo.findById(id)
            return{
                status:true,
                data:response
            }
        } catch (error) {
            return {
                status:false,
                message:error.message
            } 
        }
    }

    async deleteTodoById(id:string):Promise<IResponse>{
        try {
            const response = await this.todo.findByIdAndDelete(id)
            return{
                status:true,
            }
        } catch (error) {
            return {
                status:false,
                message:error.message
            } 
        }
    }

    async updateTodoById(todo:ToDoUpdateDto):Promise<IResponse>{
        try {
            const response = await this.todo.findByIdAndUpdate(todo.id,todo.data);
            console.log(response)
            console.log("update")
            return{
                status:true,
            }
        } catch (error) {
            return{
                status:false,
                message:error.message
            }
        }
    }
}