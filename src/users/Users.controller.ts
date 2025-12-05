import { Controller,Post, Get, Put, Delete, Param, Query, Body, Patch } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService} from './users.service';
import { UsersParamsDto } from './dto/users-params-dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){
    }
    @Post()
    async create(@Body() body: CreateUsersDto): Promise<object> {
        
        const users = await this.usersService.create(body)
        return {
            message: "User created successfully",
            user:{
                email: users.email,
                name: users.name
            } 
            
        }
        
    }
    @Get()
    async getAll(){
        const users = await this.usersService.getAll()
        return {
            message: "Successfully listed all collaborators",
            total: users.length,
            users,
        }

    }
    @Get('/:id')
    async getById(@Param() param: UsersParamsDto){
        const users = await this.usersService.getById(param.id)
        return{
            message: "User found successfully",
            users
        }
    }
    @Delete('/:id')
    async delete(@Param() param: UsersParamsDto){
        await this.usersService.delete(param.id)
        return{
            message: "User deleted sucessfully"
        }
    }
    @Patch('/:id')
    async update(
        @Param() param: UsersParamsDto,
        @Body() body: Partial<CreateUsersDto>){
            const users = await this.usersService.update(param.id, body)
            return{
                message: "User updated successfully",
                users
            }
        }
}
