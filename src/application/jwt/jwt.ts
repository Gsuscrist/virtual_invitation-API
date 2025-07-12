import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import {JwtRepository} from "./jwtRepository";
import {Invitation} from "../../domain/entity/invitation";


dotenv.config();


export class Jwt implements JwtRepository{

    private blacklist: string[] = [];
    private readonly secretKey: string;

    constructor() {
        this.secretKey = process.env.SECRET_JWT || ' ';
    }

    async  generateToken(invitation: Invitation): Promise<any> {
        const payload = {
            username: invitation.credentials.username,
        }
        return jwt.sign(payload, this.secretKey);
    }

    addToBlackList(token: any): void {
        this.blacklist.push(token)
    }

    async isTokenRevoked(token: string): Promise<boolean> {
        return this.blacklist.includes(token);
    }
}