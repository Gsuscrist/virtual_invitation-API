import {IInvitationRepository} from "../../domain/repository/IInvitationRepository";
import {Credentials} from "../../domain/entity/credentials";
import {EventType} from "../../domain/entity/invitation";

export class InvitationUseCase {
    constructor(readonly repository:IInvitationRepository) {
    }

    async signIn(credentials:Credentials){
        try{
            return await this.repository.signIn(credentials)
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async signUp(
        credentials:Credentials,
        honoreeName:string,
        eventDate:Date,
        eventType:EventType,
        confirmationDeadline:Date,
        phoneNumber:string,
        honoreeCode:string,
    ){
        try{
            return await this.repository.signUp(
                credentials,honoreeName,eventDate,eventType,confirmationDeadline,phoneNumber,honoreeCode
            )
        }catch (e) {
            console.error(e)
            return false
        }
    }

    async delete(uuid:string){
        try{
            return await this.repository.delete(uuid)
        }catch (e) {
            console.error(e)
            return false
        }
    }

    async getInvitation(uuid:string){
        try{
            return await this.repository.getInvitation(uuid)
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async update(uuid:string, invitation:any){
        try{
            return await this.repository.update(uuid,invitation)
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async sendInvitations(honoreeCode:string){
        try{
            return await this.repository.sendInvitations(honoreeCode)
        }catch (e) {
            console.error(e)
            return false
        }
    }

}