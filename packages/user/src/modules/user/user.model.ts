import * as mongoose from "mongoose"

export const UserSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    birthDate:{
        type:Date,
        required: true,
    },
})

export interface User extends mongoose.Document{
    id:string,
    fullName:string,
    password:string,
    email:string,
    birthDate:Date
}