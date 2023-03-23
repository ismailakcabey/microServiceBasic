import { Injectable, Inject, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { resolve } from "path";
import { UserDto, UserLoginDto } from "./user.dto";
import {Response, Request, response} from 'express';
import { async, map, Observable } from 'rxjs';
import * as flatted from 'flatted';
const amqp = require("amqplib")
@Injectable()
export class UserService{
    constructor(
        @Inject('USER_SERVICE') private readonly clientServiceUser:ClientProxy,
        private jwtService: JwtService,
    ){}
    async addUser(user:UserDto){
        try {
            const pattern = { cmd : 'create_user'}
            const payload = user
            const response = await this.clientServiceUser.send(pattern,payload).toPromise()
            return response
        } catch (error) {
            return {
                status:false,
                message:error.message
            }
        }
    }

    async getUserExcel(user:UserDto,id:string){
        try {
            const pattern = { cmd : 'get_user_excel'}
            const payload = {
                id:id,
                user:user
            }
            const response = await this.clientServiceUser.send(pattern,payload).toPromise()
            return response
        } catch (error) {
            return {
                status:false,
                message:error.message
            }
        }
    }

    async listUser(user:UserDto){
        try {
            const pattern = { cmd : 'list_user'}
            const payload = user
            const response = await this.clientServiceUser.send(pattern,payload).toPromise()
            return response
        } catch (error) {
            return {
                status:false,
                message:error.message
            }
        }
    }

    async getUserById(id:string){
        try {
            const pattern = { cmd: 'get_user_by_id' }
            const payload = id
            const response = await this.clientServiceUser.send(pattern, payload).toPromise()
            return response
        } catch (error) {
            return{
                status:false,
                message:error.message
            }
        }
    }

    async updateUserById(id:string,user:UserDto){
        try {
            const pattern = { cmd: 'update_user_by_id' }
            const payload = {
                id:id,
                data:user
            }
            const response = await this.clientServiceUser.send(pattern, payload).toPromise()
            return response
        } catch (error) {
            return{
                status:false,
                message:error.message
            } 
        }
    }

    async deleteUserById(id:string){
        try {
            const pattern = { cmd: 'delete_user_by_id' }
            const payload = id
            const response = await this.clientServiceUser.send(pattern, payload).toPromise()
            return response
        } catch (error) {
            return{
                status:false,
                message:error.message
            }
        }
    }


    async login(user:UserLoginDto){
        try {
            const pattern = { cmd: 'login_user_control_by_mail' }
            const payload = user
            const response = await this.clientServiceUser.send(pattern, payload).toPromise()
            return response
        } catch (error) {
            return{
                status:false,
                message:error.message
            }
        }
    }

    async authControl(request:Request){
        try {
            //@ts-ignore
            const token = request.headers?.authorization
            const data = await this.jwtService.verifyAsync(token);
            if (!data) {
                return {
                    status:false,
                    data:null
                }
            }
            const user = await this.getUserById(data?.id)
            if(!(user.status)) {
                return{
                    status:false,
                    message:'user is not defined'
                }
            }
            return {
                status:true,
                user:data
            }
        } catch (error) {
            console.error(error)
        }
    }
}