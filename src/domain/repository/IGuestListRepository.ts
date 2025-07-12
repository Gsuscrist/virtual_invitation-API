import {GuestList} from "../entity/guestList";

export interface IGuestListRepository {
    // crud, confirm asisttence, send invitation, send reminder, get all by invitacion id,

    create(
        name: string,
        invitationQty: number,
        hasKids:boolean,
        invitationId: string,
        phoneNumber: string,
    ):Promise<Boolean>

    getGuestListOf(invitationId: string):Promise<GuestList[]|null>

    getGuestListBy(id: string):Promise<GuestList|null>

    update(id: string, guestList: GuestList):Promise<GuestList|null>
    delete(id: string):Promise<Boolean>

    confirmAssistance(
        id: string,
        adultsNo: number,
        kidsNo: number,
        message: string,
    ):Promise<Boolean>

    createMany(buffer:Buffer,invitationId:string):Promise<Boolean>

    sendReminder(id: string):Promise<Boolean>
}