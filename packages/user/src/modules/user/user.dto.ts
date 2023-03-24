import {
    IsString,
    IsDate,
    IsNumber,
    IsBoolean,
    IsObject
} from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'

export class UserDto{

    @IsString()
    id?:string
 
    @IsString()
    fullName?:string

    @IsString()
    email?:string

    @IsString()
    passsword?:string

    @IsDate()
    birthDate?:Date

}

export class UserExcelDto{

    @IsString()
    id?:string
 
    @IsObject()
    user:UserDto

}


export class UserUpdateDto{

    @IsString()
    id?:string
 
    
    @IsObject()
    data?:UserDto

}

export class UserLoginDto{

    @IsString()
    email?:string

    @IsString()
    password?:string
    
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