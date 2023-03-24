import {
    IsString,
    IsDate,
    IsObject,
    IsBoolean,
    IsNumber,
} from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'

export class ToDoDto{

    @IsString()
    title?: string

    @IsString()
    description?: string

    @IsObjectId()
    userId: string

    @IsDate()
    createdAt?: Date

    @IsDate()
    updatedAt?: Date

}

export class ToDoUpdateDto{

    @IsString()
    id?:string
 
    
    @IsObject()
    data?:ToDoDto

}

export class IResponse{
    
    @IsBoolean()
    status?:boolean

    @IsObject()
    data?:object

    @IsNumber()
    count?:number

    @IsString()
    message?:string
}