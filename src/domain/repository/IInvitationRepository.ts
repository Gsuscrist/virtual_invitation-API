import {EventType, Invitation} from "../entity/invitation";
import {Credentials} from "../entity/credentials";

export interface IInvitationRepository {
    signUp(
        credentials: Credentials,
        honoreeName: string,
        eventDate: Date,
        eventType: EventType,
        confirmationDeadLine: Date,
        phoneNumber:String,
        honoreeCode:String,
    ):Promise<Boolean>

    signIn(credentials: Credentials):Promise<Invitation|null> //login

    delete(uuid: string):Promise<Boolean>

    getInvitation(uuid: string):Promise<Invitation|null>

    update(uuid: string, invitation:Invitation):Promise<Invitation|null>

    sendInvitations(honoreeCode:string):Promise<Boolean>



}