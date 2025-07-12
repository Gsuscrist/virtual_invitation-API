import express from 'express';
import {Response,Request} from 'express';
import {guestListController} from "../dependencies";
import {authenticateMiddleware, sanitizeMiddleware} from "../../middleware/authenticator";
import {upload} from "../../middleware/upload";

export const guestListRoute = express.Router();

guestListRoute.post('/',authenticateMiddleware,sanitizeMiddleware,async (req:Request,res:Response)=>{
    await guestListController.create(req,res)
})

guestListRoute.post('/list/:invitation',authenticateMiddleware,upload.single('file'),async (req:Request,res:Response)=>{
    await guestListController.createMany(req,res)
})

guestListRoute.get('/:id',authenticateMiddleware,async (req:Request,res:Response)=>{
    await guestListController.getGuestListById(req,res)
})

guestListRoute.get('/invitation/:invitation',authenticateMiddleware,async (req:Request,res:Response)=>{
    await guestListController.getGuestListOfInvitation(req,res)
})

guestListRoute.delete('/:id',authenticateMiddleware,async (req:Request,res:Response)=>{
    await guestListController.delete(req,res)
})

guestListRoute.put('/:id',authenticateMiddleware,async (req:Request,res:Response)=>{
    await guestListController.update(req,res)
})

guestListRoute.post('/confirm-assistance/:id',authenticateMiddleware,sanitizeMiddleware,async (req:Request,res:Response)=>{
    await guestListController.confirmAssistance(req,res)
})

guestListRoute.get('/send-reminder/:id',authenticateMiddleware,async (req:Request,res:Response)=>{
    await guestListController.sendReminder(req,res)
})