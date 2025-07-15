import express from "express";
import {Response,Request} from 'express';
import {webhookController} from "../dependencies";


export const webhookRouter = express.Router();

webhookRouter.post('/', (req:Request,res:Response)=>{
    webhookController.logResponse(req, res)
})

webhookRouter.get('/', (req:Request,res:Response)=>{
    webhookController.getRequest(req, res)
})