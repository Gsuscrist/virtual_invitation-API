import {IGuestListRepository} from "../../domain/repository/IGuestListRepository";
import {PrismaClient} from "../../../generated/prisma";
import {Signale} from "signale";
import {GuestList} from "../../domain/entity/guestList";
import ShortUniqueId from "short-unique-id";
import csvParser from 'csv-parser';
import { Readable } from 'stream';

const prisma = new PrismaClient();
const signale = new Signale();

interface GuestCSVRow {
    name: string;
    invitationQty: string;
    hasKids: string;
    phoneNumber: string;
}


export class MysqlGuestListRepository implements IGuestListRepository{
    private parseCSV(fileBuffer: Buffer): Promise<GuestCSVRow[]> {
        return new Promise((resolve, reject) => {
            const results: GuestCSVRow[] = [];
            const stream = Readable.from(fileBuffer);

            stream
                .pipe(csvParser())
                .on('data', (row: any) => {
                    const mappedRow: GuestCSVRow = {
                        name: row['Nombre Invitacion']?.trim() || '',
                        invitationQty: row['Pases']?.trim() || '1',
                        hasKids: this.parseBoolean(row['Niños']),
                        phoneNumber: row['Telefono']?.trim() || '',
                    };
                    results.push(mappedRow);
                })
                .on('end', () => resolve(results))
                .on('error', reject);
        });
    }

    private parseBoolean(value: string): string {
        const v = value?.toLowerCase().trim();
        return (v === 'sí' || v === 'si' || v === 'yes' || v === 'true') ? 'true' : 'false';
    }

    private mapCSVToGuestData(rows: GuestCSVRow[], invitationId: string) {
        const uid = new ShortUniqueId({ length: 6 });

        return rows.map(row => ({
            uuid: uid.rnd(),
            name: row.name.trim(),
            invitation_qty: parseInt(row.invitationQty, 10),
            hasKids: row.hasKids.trim().toLowerCase() === 'true',
            phoneNumber: row.phoneNumber.trim(),
            hasConfirmed: false,
            invitationId,
        }));
    }

    async confirmAssistance(id: string, adultsNo: number, kidsNo: number,message:string): Promise<Boolean> {
        try{
            const preGuest = await this.getGuestListBy(id)
            if (!preGuest){
                return false;
            }
            const invitation = await prisma.invitation.findUnique({
                where: {
                    uuid: preGuest.invitationId,
                    AND: {deleted_at: null}
                }
            })

            if(preGuest.hasConfirmed){
                return false;
            }

            const now = new Date()

            if(!invitation || now >invitation.confirmationDeadline){
                return false;
            }

            let total_guest = adultsNo + kidsNo
            if (total_guest> preGuest.invitationQty){
                return false;
            }

            const guest = await prisma.guestList.update({
                where:{uuid:id, AND:{deleted_at:null}},
                data:{
                    hasConfirmed:true,
                    adultsNo:adultsNo,
                    kidsNo:kidsNo,
                    message:message
                }
            })
            signale.success('connection successful')
            return !!guest;
        }catch (e) {
            console.error(e)
            return false;
        }
    }

    async create(name: string, invitationQty: number, hasKids: boolean, invitationId: string, phoneNumber:string): Promise<Boolean> {
        try{
            let uid = new ShortUniqueId({length:6})
            let uuid = uid.rnd()
            const guest = await prisma.guestList.create({
                data:{
                    uuid:uuid,
                    name: name,
                    invitation_qty:invitationQty,
                    hasKids:hasKids,
                    phoneNumber:phoneNumber,
                    hasConfirmed:false,
                    invitation:{
                        connect: {uuid:invitationId}
                    }
                }
            })
            signale.success("connection successful")
            return !!guest;
        }catch (e) {
            console.error(e)
            return false;
        }
    }

    async delete(id: string): Promise<Boolean> {
        try {
             const guest =await prisma.guestList.update({
                where:{uuid:id},
                data:{
                    deleted_at: new Date()
                }
             })
            return !!guest;
        }catch (e) {
            console.error(e)
            return false;
        }
    }

    async getGuestListBy(id: string): Promise<GuestList | null> {
        try{
            const guest = await prisma.guestList.findUnique({
                where:{uuid:id,
                AND:{deleted_at:null}}
            })
            if (guest){
                return new GuestList(
                    id,
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
            }
            return null;
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async getGuestListOf(invitationId: string): Promise<GuestList[] | null> {
        try{
            const guestList = await prisma.guestList.findMany({
                where:{
                    invitationId: invitationId,
                    AND:{
                        deleted_at:null
                    }
                }
            })
            return guestList.map(guest => {
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
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async update(id: string, guestList: GuestList): Promise<GuestList | null> {
        try{
            const updatedGuest = await prisma.guestList.update({
                where:{uuid:id, AND:{deleted_at:null}},
                data:{
                    name:guestList.name,
                    invitation_qty: guestList.invitationQty,
                    hasKids:guestList.hasKids,
                }
            })
            signale.success('connection successful')
            if (updatedGuest){
                return guestList
            }
            return null;
        }catch (e) {
            console.log(e)
            return null
        }
    }

    async createMany(buffer:Buffer,invitationId:string){
        try{
            const rows = await this.parseCSV(buffer)
            const data = this.mapCSVToGuestData(rows,invitationId)
            if (data.length > 0) {
                const guestList = await prisma.guestList.createMany({ data });
                return !!guestList;

            }
            return false
        }catch (e) {
            console.error(e)
            return false
        }
    }

    async sendReminder(id: string): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }

}