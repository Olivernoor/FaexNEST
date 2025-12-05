import { Injectable } from "@nestjs/common";
import bycrypt from 'bcrypt';
@Injectable()
export class BcryptHelper {

 private salt = 10;

    async hash(password: string) {
        return await bycrypt.hash(password, this.salt);
    }
    async compare(password: string, hash: string) {
        return await bycrypt.compare(password, hash);
    }
}