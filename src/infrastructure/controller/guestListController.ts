import {Request, Response} from "express";
import {GuestListUseCase} from "../../application/useCase/guestListUseCase";
import {GuestList} from "../../domain/entity/guestList";


export class GuestListController {
    constructor(readonly repository:GuestListUseCase) {}

    async create(req:Request, res:Response){
        try{
            let {name, invitationQty, hasKids, invitationId, phoneNumber} = req.body;
            const guest = await this.repository.create(name, invitationQty, hasKids, invitationId, phoneNumber)

            if (guest){
                return res.status(201).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Created"
                })
            }
            return res.status(417).send(
                {
                    status: "Error",
                    data: {},
                    message: "Unable to create guest, try again later",
                }
            )

        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }

    async delete(req:Request, res:Response){
        try{
            let id = req.params.id;
            const guest = await this.repository.delete(id)
            if (guest){
                return res.status(200).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Deleted"
                })
            }
            return res.status(417).send(
                {
                    status: "Error",
                    data: {},
                    message: "Unable to delete guest, try again later",
                }
            )

        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }

    async getGuestListById(req:Request, res:Response){
        try{
            let id = req.params.id
            const guestList = await this.repository.getGuestListBy(id)
            if (guestList){
                return res.status(200).send({
                    status: "Success",
                    data: {
                        uuid: guestList.uuid,
                        name: guestList.name,
                        invitationQty: guestList.invitationQty,
                        hasKids: guestList.hasKids,
                        hasConfirmed: guestList.hasConfirmed,
                        invitationId: guestList.invitationId,
                    }
                })
            }
            return  res.status(417).send({
                status: "Error",
                data: {},
                message: "Unable to obtain guest",
            })

        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }

    async getGuestListOfInvitation(req:Request, res:Response){
        try{
            let invitationId = req.params.invitation
            const guestList = await this.repository.getGuestListOf(invitationId)
            if (guestList){
                return res.status(200).send({
                    status: "Success",
                    data: {
                        guestList: guestList.map(guest => {
                            return {
                                uuid: guest.uuid,
                                name: guest.name,
                                invitationQty: guest.invitationQty,
                                hasKids: guest.hasKids,
                            }
                        })
                    },
                    message: "Successfully Getting Guest List"
                })
            }
            return  res.status(417).send({
                status: "Error",
                data: [],
                message: "Unable to obtain guest",
            })
        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }

    async update(req:Request, res:Response){
        try{
            let id = req.params.id
            let {name, invitationQty, hasKids, invitationId,hasConfirmed, phoneNumber} = req.body;
            const guest = new GuestList(id, name, invitationQty, hasKids,hasConfirmed, invitationId, phoneNumber)
            const updateGuest = await this.repository.update(id, guest)
            if (updateGuest){
                return res.status(200).send({
                    status: "Success",
                    data: {
                        name: updateGuest.name,
                        invitationQty: updateGuest.invitationQty,
                        hasKids: updateGuest.hasKids,
                        invitationId: updateGuest.invitationId,
                        hasConfirmed: updateGuest.hasConfirmed,
                    }
                })
            }
            return  res.status(417).send({
                status: "Error",
                data: {},
                message: "Error during update record"
            })


        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }

    async createMany(req:Request,res:Response){
        try {
            const invitationId = req.params.invitation
            const file = req.file
            if(!file){
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "No file uploaded"
                })
            }
            const success = await this.repository.createMany(file.buffer,invitationId)
            if (success){
                return res.status(201).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Created"
                })
            }
            return res.status(417).send({
                status: "Error",
                data: {},
                message: "Error during create many"
            })

        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }

    async confirmAssistance(req:Request, res:Response){
        try{
            let id = req.params.id
            let {adultsNo, kidsNo, message} = req.body;

            const assistance = await this.repository.confirmAssistance(id, adultsNo, kidsNo, message)
            if (assistance){
                return res.status(200).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Confirmed Assistance"
                })
            }
            return res.status(417).send(
                {
                    status: "Error",
                    data: {},
                    message: "Unable to confirm assistance, try again later",
                }
            )


        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }

    async sendReminder(req:Request, res:Response){
        try{
            let id = req.params.id
            const guest = await this.repository.sendReminder(id)
            if (guest){
                return res.status(200).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Sent Reminder"
                })
            }
            return res.status(417).send(
                {error: "Error",
                data: {},
                message: "Unable to send reminder, try again later",
                }
            )
        }catch (e) {
            console.error(e)
            return res.status(500).send(
                {
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                }
            )
        }
    }
}