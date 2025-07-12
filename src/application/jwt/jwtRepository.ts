import {Invitation} from "../../domain/entity/invitation";

export interface JwtRepository{
    generateToken(invitation: Invitation): Promise<any>

    addToBlackList(token: any):void

    isTokenRevoked(token: string): Promise<boolean>
}