import express from 'express';
import {Response,Request} from 'express';
import {invitationController} from "../dependencies";
import {authenticateMiddleware, sanitizeMiddleware} from "../../middleware/authenticator";


export const invitationRoute = express.Router();

invitationRoute.post('/sign-up',sanitizeMiddleware,async (req:Request,res:Response)=>{
    await invitationController.signUp(req,res)
});

invitationRoute.post('/sign-in',sanitizeMiddleware,async (req:Request,res:Response)=>{
    await invitationController.signIn(req,res)
})

invitationRoute.get('/:id',authenticateMiddleware,async (req:Request,res:Response)=>{
    await invitationController.getInvitation(req,res)
})

invitationRoute.delete('/:id',authenticateMiddleware,async (req:Request,res:Response)=>{
    await invitationController.delete(req,res)
})

invitationRoute.put('/:id',authenticateMiddleware, sanitizeMiddleware, async (req:Request,res:Response)=>{
    await invitationController.update(req,res)
})

invitationRoute.get('/send-invitations/:code',authenticateMiddleware,async (req:Request,res:Response)=>{
    await invitationController.sendInvitations(req,res)
})

