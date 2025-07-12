import {IInvitationRepository} from "../../domain/repository/IInvitationRepository";
import {EVENT_METADATA_MAP, EventMetadata, EventType, Invitation} from "../../domain/entity/invitation";
import {Credentials} from "../../domain/entity/credentials";
import {PrismaClient} from "../../../generated/prisma";
import {GuestList} from "../../domain/entity/guestList";
import {Signale} from "signale";
import {encryptService} from "../dependencies";
import ShortUniqueId from "short-unique-id";
import axios from 'axios';


const prisma = new PrismaClient()
const signale = new Signale();


export class MysqlInvitationRepository implements IInvitationRepository {
    private readonly whatsappToken: string;
    private readonly metaVersion: string;
    private readonly phoneId: string;

    constructor(){
        this.whatsappToken = process.env.WHATSAPP_TOKEN || ''
        this.metaVersion = process.env.META_VERSION || ''
        this.phoneId = process.env.PHONE_ID || ''
    }


    private getEventMetadata(eventType: EventType): EventMetadata {
        const metadata = EVENT_METADATA_MAP[eventType];
        if (!metadata) {
            return { description: "el evento", urlPrefix: "miEvento" };
        }
        return metadata;
    }

    private async getGuestConfigData(guest: { id: string; phone: any; event: string; honoree: string; contact: string; honoreeCode:string }){
        let phoneNumber = guest.phone
        let honoree = guest.honoree
        let contactNumber = guest.contact
        let {description, urlPrefix} = this.getEventMetadata(guest.event as EventType)
        let urlPostfix = `/${urlPrefix}/${guest.honoreeCode}/${guest.id}`
        let data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": `52${phoneNumber}`,
            "type": "template",
            "template": {
                "name": "virtual_invitation",
                "language": {
                    "code": "es_MX"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": `${description}`
                            },
                            {
                                "type": "text",
                                "text": `${honoree}`
                            },
                            {
                                "type": "text",
                                "text": `https://invitaciones-virtuales.com.mx${urlPostfix}`
                            },
                            {
                                "type": "text",
                                "text": `${contactNumber}`
                            }
                        ]
                    }
                ]
            }
        });
        return {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/${this.metaVersion}/${this.phoneId}/messages`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.whatsappToken}`
            },
            data : data
        };
    }

    async delete(uuid: string): Promise<Boolean> {
        try {
            const invitationDelete = await prisma.invitation.update({
                where: {
                    uuid: uuid,
                    AND: {deleted_at: null}
                },
                data: {
                    deleted_at: new Date()
                }
            })
            signale.success("connection successful")
            return !!invitationDelete;
        }catch (e) {
            console.error(e)
            return false;
        }
    }

    async getInvitationBy(honoreeCode: string): Promise<Invitation | null> {
        try {
            const invitation = await prisma.invitation.findUnique({
                where: {
                    honoreeCode: honoreeCode,
                    AND: {deleted_at: null}
                },
                include: {guestList: true}
            })
            signale.success("connection successful")
            if (invitation) {
                const credentials = new Credentials(invitation.username, invitation.password)
                const guestList:GuestList[] = invitation.guestList.map(guest => {
                    return new GuestList(
                        guest.uuid,
                        guest.name,
                        guest.invitation_qty,
                        guest.hasKids,
                        guest.hasConfirmed,
                        guest.invitationId,
                        guest.phoneNumber,
                        guest.adultsNo,
                        guest.kidsNo,
                        guest.message,
                        guest.deleted_at);
                })
                return new Invitation(
                    invitation.uuid,
                    credentials,
                    invitation.honoreeName,
                    invitation.eventDate,
                    invitation.eventType as EventType,
                    invitation.confirmationDeadline,
                    invitation.phoneNumber,
                    invitation.honoreeCode,
                    guestList);
            }
        } catch (e) {
            console.error(e)
        }
        return null;
    }

    async getInvitation(uuid: string): Promise<Invitation | null> {
        try {
            const invitation = await prisma.invitation.findUnique({
                where: {
                    uuid: uuid,
                    AND: {deleted_at: null}
                },
                include: {guestList: true}
            })
            signale.success("connection successful")
            if (invitation) {
                const credentials = new Credentials(invitation.username, invitation.password)
                const guestList:GuestList[] = invitation.guestList.map(guest => {
                    return new GuestList(
                        guest.uuid,
                        guest.name,
                        guest.invitation_qty,
                        guest.hasKids,
                        guest.hasConfirmed,
                        guest.invitationId,
                        guest.phoneNumber,
                        guest.adultsNo,
                        guest.kidsNo,
                        guest.message,
                        guest.deleted_at);
                })
                return new Invitation(
                    uuid,
                    credentials,
                    invitation.honoreeName,
                    invitation.eventDate,
                    invitation.eventType as EventType,
                    invitation.confirmationDeadline,
                    invitation.phoneNumber,
                    invitation.honoreeCode,
                    guestList);
            }
        } catch (e) {
            console.error(e)
        }
        return null;
    }

    async signIn(credentials: Credentials): Promise<Invitation | null> {
        try{
            const invitation = await prisma.invitation.findUnique({
                where:{
                    username:credentials.username,
                    AND:{deleted_at:null}
                },
                include:{guestList:true}
            })
            if(invitation){
                if (await encryptService.compare(credentials.password,invitation.password)){
                    signale.success("Connection successful")
                    const guestList:GuestList[] = invitation.guestList.map(guest => {
                        return new GuestList(
                            guest.uuid,
                            guest.name,
                            guest.invitation_qty,
                            guest.hasKids,
                            guest.hasConfirmed,
                            guest.invitationId,
                            guest.phoneNumber,
                            guest.adultsNo,
                            guest.kidsNo,
                            guest.message,
                            guest.deleted_at
                        )
                    })
                    return new Invitation(
                        invitation.uuid,
                        credentials,
                        invitation.honoreeName,
                        invitation.eventDate,
                        invitation.eventType as EventType,
                        invitation.confirmationDeadline,
                        invitation.phoneNumber,
                        invitation.honoreeCode,
                        guestList);
                }
            }
            return null;
        }catch (e) {
            console.error(e)
            return null;
        }
    }

    async signUp(credentials: Credentials, honoreeName: string, eventDate: Date, eventType: EventType, confirmationDeadLine: Date, phoneNumber:string,honoreeCode:string): Promise<Boolean> {
        try {
            let uid = new ShortUniqueId({length:6})
            let uuid = uid.rnd()
            const invitationSign = await prisma.invitation.create({
                data:{
                    uuid:uuid,
                    username: credentials.username,
                    password:credentials.password,
                    honoreeName:honoreeName,
                    eventDate:eventDate,
                    eventType: eventType as EventType,
                    confirmationDeadline: confirmationDeadLine,
                    phoneNumber:phoneNumber,
                    honoreeCode:honoreeCode
                }
            })
            signale.success("connection successful")
            return !!invitationSign;
        }catch (e) {
            console.error(e)
            return false;
        }
    }

    async update(uuid: string, invitation: Invitation): Promise<Invitation | null> {
        try{
            const updatedInvitation = await prisma.invitation.update({
                where:{uuid:uuid},
                data:{
                    honoreeName:invitation.honoreeName,
                    eventDate: invitation.eventDate,
                    eventType: invitation.eventType,
                    confirmationDeadline: invitation.confirmationDeadLine,
                    phoneNumber:invitation.phoneNumber,
                }
            })
            signale.success("connection successful")
            if (updatedInvitation){
                return invitation
            }
            return null;
        }catch (e) {
            console.error(e)
            return null;
        }
    }

    async sendInvitations(honoreeCode:string): Promise<boolean> {
        try {
            const invitation = await this.getInvitationBy(honoreeCode);
            if (!invitation) {
                signale.warn(`Invitation with honoreeCode ${honoreeCode} not found`);
                return false;
            }
            const guests = invitation.guestList;
            if (!guests || guests.length === 0) {
                signale.warn(`No guests found for invitation ${honoreeCode}`);
                return false;
            }

            let allSent = true;

            for (const guest of guests) {
                const guest_data = {
                    id: guest.uuid,
                    phone: guest.phoneNumber,
                    event: invitation.eventType,
                    honoree: invitation.honoreeName,
                    contact: invitation.phoneNumber,
                    honoreeCode: invitation.honoreeCode,
                };

                const config = await this.getGuestConfigData(guest_data);

                try {
                    const response = await axios.request(config);
                    if (response.status !== 200) {
                        signale.error(
                            `Failed to send to ${guest.phoneNumber}: status ${response.status}`
                        );
                        allSent = false;
                    } else {
                        signale.success(`Invitation sent to ${guest.phoneNumber}`);
                    }
                } catch (requestError) {
                    signale.error(
                        `Error sending to ${guest.phoneNumber}: ${requestError}`
                    );
                    allSent = false;
                }
            }

            return allSent;
        } catch (e) {
            console.error(`Unexpected error in sendInvitations:`, e);
            return false;
        }
    }



}







