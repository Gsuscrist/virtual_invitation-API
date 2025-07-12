"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMiddleware = exports.authenticateMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const xss_1 = __importDefault(require("xss"));
const validator_1 = require("validator");
dotenv_1.default.config();
const secretKey = process.env.SECRET_JWT;
if (!secretKey) {
    throw new Error("SECRET_JWT no está definido en el archivo .env");
}
const authenticateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }
    try {
        try {
            const decode = jsonwebtoken_1.default.verify(token, secretKey);
            req.token = decode;
            next();
        }
        catch (e) {
            console.log(e);
            res.status(401).json({
                message: "Unauthorized",
                error: e
            });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server Error",
            error: e
        });
    }
});
exports.authenticateMiddleware = authenticateMiddleware;
// Middleware para prevenir HTML escaping y JavaScript escaping
const sanitizeMiddleware = (req, res, next) => {
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = (0, xss_1.default)((0, validator_1.escape)(obj[key]));
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };
    // Sanitize req.body, req.query, and req.params
    if (req.body)
        sanitizeObject(req.body);
    if (req.query)
        sanitizeObject(req.query);
    if (req.params)
        sanitizeObject(req.params);
    next();
};
exports.sanitizeMiddleware = sanitizeMiddleware;
