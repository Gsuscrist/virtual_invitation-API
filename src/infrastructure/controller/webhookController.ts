import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";

//TODO: Migrate to clear infrastructure

export class WebhookController {
    private readonly verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || ' ';

    getRequest(req: Request, res: Response) {
        const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;
        if (mode === 'subscribe' && token === this.verifyToken) {
            console.log('WEBHOOK VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.status(403).end();
        }
    }

    logResponse(req: Request, res: Response) {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const logDir = path.join(__dirname, "../../../logs");
        const logFile = path.join(logDir, "webhook-log.jsonl");
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logEntry = {
            timestamp,
            body: req.body
        };
        fs.appendFile(logFile, JSON.stringify(logEntry) + "\n", (err) => {
            if (err) {
                console.error("Error al guardar log del webhook:", err);
            }
        });

        res.status(200).end();
    }
}
