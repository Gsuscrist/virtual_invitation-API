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
exports.invitationRoute = void 0;
const express_1 = __importDefault(require("express"));
const dependencies_1 = require("../dependencies");
const authenticator_1 = require("../../middleware/authenticator");
exports.invitationRoute = express_1.default.Router();
exports.invitationRoute.post('/sign-up', authenticator_1.sanitizeMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.invitationController.signUp(req, res);
}));
exports.invitationRoute.post('/sign-in', authenticator_1.sanitizeMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.invitationController.signIn(req, res);
}));
exports.invitationRoute.get('/:id', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.invitationController.getInvitation(req, res);
}));
exports.invitationRoute.delete('/:id', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.invitationController.delete(req, res);
}));
exports.invitationRoute.put('/:id', authenticator_1.authenticateMiddleware, authenticator_1.sanitizeMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.invitationController.update(req, res);
}));
exports.invitationRoute.get('/send-invitations/:code', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.invitationController.sendInvitations(req, res);
}));
