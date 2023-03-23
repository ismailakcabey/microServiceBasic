import { Inject , Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ToDoDto } from './todo.dto'
import { ToDo } from './todo.model'

@Injectable()
export class TodoService{
    constructor(
        @InjectModel('ToDoToDo') private readonly todo:Model<ToDo>
    ){}

    async addToDo(todo:ToDoDto){
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
}