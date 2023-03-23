import { ObjectId } from "mongodb"
import * as mongoose from "mongoose"

export const ToDoSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required: true,
    },
    createdAt:{
        type:Date,
        required: true,
        default: new Date
    },
    updatedAt:{
        type:Date,
        required: true,
        default: new Date
    },
})

export interface ToDo extends mongoose.Document{
    id:string,
    title:string,
    description:string,
    createdAt:Date
    updatedAt:Date,
    userId:mongoose.Types.ObjectId
}

export interface ToDoExcel extends mongoose.Document{
    title:string,
    description:string,
    createdAt:Date,
    updatedAt:Date
}