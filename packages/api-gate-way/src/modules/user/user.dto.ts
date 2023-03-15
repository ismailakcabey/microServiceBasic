import {
    IsString,
    IsDate,
    IsNumber,
    IsBoolean
} from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'

export class UserDto{
 
    @IsString()
    fullName?:string

    @IsString()
    email?:string

    @IsString()
    passsword?:string

    @IsDate()
    birthDate?:Date

}