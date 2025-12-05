import { Injectable, BadRequestException,  InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Users } from './schema/users.schema';
import { UsersRepository } from './repository/users.repository';
import { CreateUsersDto } from './dto/create-users.dto';
import { BcryptHelper } from './helpers/bcrypt.helper';
@Injectable()
export class UsersService {
    constructor(
        private userRepository: UsersRepository,
        private bcrypt: BcryptHelper
    )
    {}

    async create(data: CreateUsersDto): Promise<Users> {

        const userExist = await this.userRepository.findByOne({
            email: data.email
        })

        if (userExist) {
            throw new BadRequestException('este email já esta cadastrado')
        }
        
        data.password = await this.bcrypt.hash(data.password)

        const payload = {
            ...data,
            status: false
        } as Users

        const created = await this.userRepository.create(payload)

        if (!created) {
            throw new InternalServerErrorException('Ocorreu um erro interno')
        }

        return created;
    }

    async getAll(): Promise<Users[]> {
        const users = await this.userRepository.findAll()

        return users;
    }

    async getById(id: string): Promise<Users> {
        
        const user = await this.userRepository.findById(id)

        if (!user) {
            throw new NotFoundException('Usuário não encontrado')
        }

        return user
    }

    async delete(id: string) {
        const userDeleted = await this.userRepository.delete(id)

        if (!userDeleted) {
            throw new InternalServerErrorException('Ocorreu um erro interno')
        }

        return userDeleted
    }

    async update(id: string, data: Partial<CreateUsersDto>) {
        const userUpdate = await this.userRepository.update(id, data)

        return userUpdate;
    }
}
