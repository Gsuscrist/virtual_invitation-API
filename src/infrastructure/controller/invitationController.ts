import {Request, Response} from "express";
import {InvitationUseCase} from "../../application/useCase/invitationUseCase";
import {JwtRepository} from "../../application/jwt/jwtRepository";
import {Credentials} from "../../domain/entity/credentials";
import {EncryptService} from "../../domain/service/encryptService";
import {Invitation} from "../../domain/entity/invitation";


export class InvitationController {
    constructor(readonly repository: InvitationUseCase, readonly jwt: JwtRepository, readonly encrypt: EncryptService) {
    }

    async signIn(req: Request, res: Response) {
        try {
            let {username, password} = req.body.credentials;
            const credentials = new Credentials(username, password);
            const invitation = await this.repository.signIn(credentials)
            if (invitation) {
                let token = await this.jwt.generateToken(invitation);
                return res.status(200).send({
                    status: "Success",
                    data: {
                        token: token,
                        uuid: invitation.uuid,
                        username: username,
                        honereeName: invitation.honoreeName,
                        eventType: invitation.eventType,
                        eventDate: invitation.eventDate,
                        eventDeadLine: invitation.confirmationDeadLine
                    },
                    message: "Successfully Sign In"
                });
            }
            return res.status(401).send({
                status: "Error",
                data: [],
                message: "Unauthorized"
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send({
                status: "Error",
                error: e,
                message: 'Internal Server Error',
            })
        }
    }

    async signUp(req: Request, res: Response) {
        try {
            let {username, password} = req.body.credentials;
            let {honoreeName, eventDate, eventType, eventDeadLine,phoneNumber,honoreeCode} = req.body;
            password = await this.encrypt.execute(password)
            const credentials = new Credentials(username, password);
            const invitationSign = await this.repository.signUp(credentials, honoreeName, new Date(eventDate), eventType, new Date(eventDeadLine),phoneNumber,honoreeCode)
            if (invitationSign) {
                return res.status(201).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Sign Up"
                })
            }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to create invitation, try again later",
                })
        } catch (e) {
            return res.status(500).send({
                status: "Error",
                error: e,
                message: 'Internal Server Error',
            })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            let id = req.params.id;
            const invitationDelete = await this.repository.delete(id)
            if(invitationDelete){
                return res.status(200).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Deleted"
                })
            }
            return res.status(417).send({
                status: "Error",
                data: {},
                message: "Unable to delete invitation, try again later",
            })

        } catch (e) {
            console.log(e)
            res.status(500).send({
                status: "Error",
                error: e,
                message: 'Internal Server Error',
            })
        }
    }

    async update(req: Request, res: Response) {
        try {
            let id = req.params.id;
            let {username, password} = req.body.credentials;
            let {honoreeName, eventDate, eventType, eventDeadLine,phoneNumber,honoreeCode} = req.body;
            const credentials = new Credentials(username, password);
            const invitation = new Invitation(
                id, credentials, honoreeName, new Date(eventDate), eventType, new Date(eventDeadLine),phoneNumber,honoreeCode)
            const updateInvitation = await this.repository.update(id, invitation)
            if (updateInvitation) {
                return res.status(200).send({
                    status: "Success",
                    data: {
                        username: username,
                        honoreeCode:updateInvitation.honoreeCode,
                        honoreeName: updateInvitation.honoreeName,
                        eventType: updateInvitation.eventType,
                        eventDate: updateInvitation.eventDate,
                        eventDeadLine: updateInvitation.confirmationDeadLine
                    },
                    message: "Successfully Updated Invitation"
                })
            }
            return  res.status(417).send({
                status: "Error",
                data: {},
                message: "Error during update record"
            })
        } catch (e) {
            console.error(e)
            return res.status(500).send({
                status: "Error",
                error: e,
                message: 'Internal Server Error',
            })
        }

    }

    async getInvitation(req: Request, res: Response) {
        try {
            let id = req.params.id;
            const invitation =  await this.repository.getInvitation(id)
            if (invitation) {
                return res.status(200).send({
                    status: "Success",
                    data: {
                        username: invitation.credentials.username,
                        honoreeCode:invitation.honoreeCode,
                        honoreeName:invitation.honoreeName,
                        eventType: invitation.eventType,
                        eventDate: invitation.eventDate,
                        eventDeadLine: invitation.confirmationDeadLine
                    },
                    message: "Successfully Getting Invitation"
                })
            }
            return res.status(417).send({
                status: "Error",
                data: [],
                message: "Unable to obtain invitation",
            })

        }catch (e) {
            console.error(e)
            return res.status(500).send({
                status: "Error",
                error: e,
                message: 'Internal Server Error',
            })
        }
    }

    async sendInvitations(req:Request,res:Response){
        try{
            let honoreeCode = req.params.code
            const status = await  this.repository.sendInvitations(honoreeCode)
            if (status){
                return res.status(200).send({
                    status: "Success",
                    data: {},
                    message: "Successfully Sending Invitations"
                })
            }
            return res.status(417).send({
                status: "Error",
                data: {},
                message: "Unable to obtain invitation, try again later",
            })

        }catch (e) {
            console.error(e)
            return res.status(500).send({
                status: "Error",
                error: e,
                message: 'Internal Server Error',
            })
        }
    }
}