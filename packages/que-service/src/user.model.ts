import * as mongoose from "mongoose"

export interface User extends mongoose.Document{
    id:string,
    fullName:string,
    password:string,
    email:string,
    birthDate:Date
}