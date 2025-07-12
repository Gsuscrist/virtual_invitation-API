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
exports.guestListRoute = void 0;
const express_1 = __importDefault(require("express"));
const dependencies_1 = require("../dependencies");
const authenticator_1 = require("../../middleware/authenticator");
const upload_1 = require("../../middleware/upload");
exports.guestListRoute = express_1.default.Router();
exports.guestListRoute.post('/', authenticator_1.authenticateMiddleware, authenticator_1.sanitizeMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.create(req, res);
}));
exports.guestListRoute.post('/list/:invitation', authenticator_1.authenticateMiddleware, upload_1.upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.createMany(req, res);
}));
exports.guestListRoute.get('/:id', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.getGuestListById(req, res);
}));
exports.guestListRoute.get('/invitation/:invitation', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.getGuestListOfInvitation(req, res);
}));
exports.guestListRoute.delete('/:id', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.delete(req, res);
}));
exports.guestListRoute.put('/:id', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.update(req, res);
}));
exports.guestListRoute.post('/confirm-assistance/:id', authenticator_1.authenticateMiddleware, authenticator_1.sanitizeMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.confirmAssistance(req, res);
}));
exports.guestListRoute.get('/send-reminder/:id', authenticator_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield dependencies_1.guestListController.sendReminder(req, res);
}));
