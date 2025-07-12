import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import xss from "xss";
import { escape as escapeJS } from "validator";
dotenv.config();

const secretKey: string | undefined = process.env.SECRET_JWT;
if (!secretKey) {
    throw new Error("SECRET_JWT no está definido en el archivo .env");
}


export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('Authorization');

    if (!token) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }

    try {
        try {
            const decode = jwt.verify(token, secretKey);
            (req as any).token = decode;
            next();
        } catch (e) {
            console.log(e);
            res.status(401).json({
                message: "Unauthorized",
                error: e
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server Error",
            error: e
        });
    }
};



// Middleware para prevenir HTML escaping y JavaScript escaping
export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const sanitizeObject = (obj: any) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = xss(escapeJS(obj[key]));
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };

    // Sanitize req.body, req.query, and req.params
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);

    next();
};