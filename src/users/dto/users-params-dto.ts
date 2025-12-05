import { IsMongoId, IsNotEmpty, IsString } from "class-validator";


export class UsersParamsDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string;
}