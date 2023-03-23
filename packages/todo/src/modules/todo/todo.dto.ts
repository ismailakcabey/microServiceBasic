import {
    IsString,
    IsDate,
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