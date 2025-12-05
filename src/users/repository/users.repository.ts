import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "../schema/users.schema";
import { Model } from "mongoose";
@Injectable()
 export class UsersRepository {
    constructor( 
        @InjectModel(Users.name)
        private usermodel: Model<Users>
    )
    {}
    async create(data: Users): Promise<Users | null> {
        const createUser = new this.usermodel(data)

        return createUser.save()
    }
    async findAll(): Promise<Users[]>{
        return this.usermodel.find()
    }

    async findById(id: string) : Promise<Users | null>{
        return this.usermodel.findById(id)
    }

    async findByOne(filter: object = {}): Promise<Users | null>{
        return this.usermodel.findOne(filter)
    }
    
    async update(id: string, data: Partial<Users>): Promise<Users | null>{
        return this.usermodel.findByIdAndUpdate(id, data, {
            new: true,
        });
    }
    async  delete(id: string): Promise<Users | null>{
        return this.usermodel.findByIdAndDelete(id)
    }
}