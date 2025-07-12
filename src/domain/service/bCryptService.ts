import bcrypt from "bcrypt"
import {EncryptService} from "./encryptService";

export class BCryptService implements EncryptService{
    constructor() {
    }

    async execute(data: any): Promise<any> {
        const saltRounds = 10;
        return await bcrypt.hash(data, saltRounds);
    }

    async compare(data: any, hash:any): Promise<any> {
        return await bcrypt.compare(data, hash);
    }

}