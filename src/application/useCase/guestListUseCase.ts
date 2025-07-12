import {IGuestListRepository} from "../../domain/repository/IGuestListRepository";


export class GuestListUseCase {
    constructor(readonly repository:IGuestListRepository) {
    }

    async create(
        name:string,
        invitationQty:number,
        hasKids:boolean,
        invitationId:string,
        phoneNumber:string
    ){
        try{
            return await this.repository.create(name,invitationQty,hasKids,invitationId,phoneNumber)
        }catch (e) {
            console.error(e)
            return false
        }
    }

    async getGuestListOf(invitationId:string){
        try{
            return await this.repository.getGuestListOf(invitationId)
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async getGuestListBy(id:string){
        try{
            return await this.repository.getGuestListBy(id)
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async update(id:string, guestList:any){
        try{
            return await this.repository.update(id,guestList)
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async delete(id:string){
        try{
            return await this.repository.delete(id)
        }catch (e) {
            console.error(e)
            return false
        }
    }

    async confirmAssistance(
        id:string,
        adultsNo:number,
        kidsNo:number,
        message:string,
    ){
        try{
            return await this.repository.confirmAssistance(id,adultsNo,kidsNo,message)
        }catch (e) {
            console.error(e)
            return null
        }
    }

    async sendReminder(id:string){
        try{
            return await this.repository.sendReminder(id)
        }catch (e) {
            console.error(e)
            return false
        }
    }

    async createMany(buffer:Buffer,invitationId:string){
        try{
            return await this.repository.createMany(buffer,invitationId)
        }catch (e) {
            console.error(e)
            return false
        }
    }
}