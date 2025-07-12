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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationController = void 0;
const credentials_1 = require("../../domain/entity/credentials");
const invitation_1 = require("../../domain/entity/invitation");
class InvitationController {
    constructor(repository, jwt, encrypt) {
        this.repository = repository;
        this.jwt = jwt;
        this.encrypt = encrypt;
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, password } = req.body.credentials;
                const credentials = new credentials_1.Credentials(username, password);
                const invitation = yield this.repository.signIn(credentials);
                if (invitation) {
                    let token = yield this.jwt.generateToken(invitation);
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
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                });
            }
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, password } = req.body.credentials;
                let { honoreeName, eventDate, eventType, eventDeadLine, phoneNumber, honoreeCode } = req.body;
                password = yield this.encrypt.execute(password);
                const credentials = new credentials_1.Credentials(username, password);
                const invitationSign = yield this.repository.signUp(credentials, honoreeName, new Date(eventDate), eventType, new Date(eventDeadLine), phoneNumber, honoreeCode);
                if (invitationSign) {
                    return res.status(201).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Sign Up"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to create invitation, try again later",
                });
            }
            catch (e) {
                return res.status(500).send({
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const invitationDelete = yield this.repository.delete(id);
                if (invitationDelete) {
                    return res.status(200).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Deleted"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to delete invitation, try again later",
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).send({
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let { username, password } = req.body.credentials;
                let { honoreeName, eventDate, eventType, eventDeadLine, phoneNumber, honoreeCode } = req.body;
                const credentials = new credentials_1.Credentials(username, password);
                const invitation = new invitation_1.Invitation(id, credentials, honoreeName, new Date(eventDate), eventType, new Date(eventDeadLine), phoneNumber, honoreeCode);
                const updateInvitation = yield this.repository.update(id, invitation);
                if (updateInvitation) {
                    return res.status(200).send({
                        status: "Success",
                        data: {
                            username: username,
                            honoreeCode: updateInvitation.honoreeCode,
                            honoreeName: updateInvitation.honoreeName,
                            eventType: updateInvitation.eventType,
                            eventDate: updateInvitation.eventDate,
                            eventDeadLine: updateInvitation.confirmationDeadLine
                        },
                        message: "Successfully Updated Invitation"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Error during update record"
                });
            }
            catch (e) {
                console.error(e);
                return res.status(500).send({
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                });
            }
        });
    }
    getInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const invitation = yield this.repository.getInvitation(id);
                if (invitation) {
                    return res.status(200).send({
                        status: "Success",
                        data: {
                            username: invitation.credentials.username,
                            honoreeCode: invitation.honoreeCode,
                            honoreeName: invitation.honoreeName,
                            eventType: invitation.eventType,
                            eventDate: invitation.eventDate,
                            eventDeadLine: invitation.confirmationDeadLine
                        },
                        message: "Successfully Getting Invitation"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: [],
                    message: "Unable to obtain invitation",
                });
            }
            catch (e) {
                console.error(e);
                return res.status(500).send({
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                });
            }
        });
    }
    sendInvitations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let honoreeCode = req.params.code;
                const status = yield this.repository.sendInvitations(honoreeCode);
                if (status) {
                    return res.status(200).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Sending Invitations"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to obtain invitation, try again later",
                });
            }
            catch (e) {
                console.error(e);
                return res.status(500).send({
                    status: "Error",
                    error: e,
                    message: 'Internal Server Error',
                });
            }
        });
    }
}
exports.InvitationController = InvitationController;
