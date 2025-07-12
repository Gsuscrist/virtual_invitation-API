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
exports.GuestListController = void 0;
const guestList_1 = require("../../domain/entity/guestList");
class GuestListController {
    constructor(repository) {
        this.repository = repository;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, invitationQty, hasKids, invitationId, phoneNumber } = req.body;
                const guest = yield this.repository.create(name, invitationQty, hasKids, invitationId, phoneNumber);
                if (guest) {
                    return res.status(201).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Created"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to create guest, try again later",
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
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const guest = yield this.repository.delete(id);
                if (guest) {
                    return res.status(200).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Deleted"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to delete guest, try again later",
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
    getGuestListById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const guestList = yield this.repository.getGuestListBy(id);
                if (guestList) {
                    return res.status(200).send({
                        status: "Success",
                        data: {
                            uuid: guestList.uuid,
                            name: guestList.name,
                            invitationQty: guestList.invitationQty,
                            hasKids: guestList.hasKids,
                            hasConfirmed: guestList.hasConfirmed,
                            invitationId: guestList.invitationId,
                        }
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to obtain guest",
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
    getGuestListOfInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let invitationId = req.params.invitation;
                const guestList = yield this.repository.getGuestListOf(invitationId);
                if (guestList) {
                    return res.status(200).send({
                        status: "Success",
                        data: {
                            guestList: guestList.map(guest => {
                                return {
                                    uuid: guest.uuid,
                                    name: guest.name,
                                    invitationQty: guest.invitationQty,
                                    hasKids: guest.hasKids,
                                };
                            })
                        },
                        message: "Successfully Getting Guest List"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: [],
                    message: "Unable to obtain guest",
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
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let { name, invitationQty, hasKids, invitationId, hasConfirmed, phoneNumber } = req.body;
                const guest = new guestList_1.GuestList(id, name, invitationQty, hasKids, hasConfirmed, invitationId, phoneNumber);
                const updateGuest = yield this.repository.update(id, guest);
                if (updateGuest) {
                    return res.status(200).send({
                        status: "Success",
                        data: {
                            name: updateGuest.name,
                            invitationQty: updateGuest.invitationQty,
                            hasKids: updateGuest.hasKids,
                            invitationId: updateGuest.invitationId,
                            hasConfirmed: updateGuest.hasConfirmed,
                        }
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
    createMany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invitationId = req.params.invitation;
                const file = req.file;
                if (!file) {
                    return res.status(417).send({
                        status: "Error",
                        data: {},
                        message: "No file uploaded"
                    });
                }
                const success = yield this.repository.createMany(file.buffer, invitationId);
                if (success) {
                    return res.status(201).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Created"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Error during create many"
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
    confirmAssistance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let { adultsNo, kidsNo, message } = req.body;
                const assistance = yield this.repository.confirmAssistance(id, adultsNo, kidsNo, message);
                if (assistance) {
                    return res.status(200).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Confirmed Assistance"
                    });
                }
                return res.status(417).send({
                    status: "Error",
                    data: {},
                    message: "Unable to confirm assistance, try again later",
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
    sendReminder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const guest = yield this.repository.sendReminder(id);
                if (guest) {
                    return res.status(200).send({
                        status: "Success",
                        data: {},
                        message: "Successfully Sent Reminder"
                    });
                }
                return res.status(417).send({ error: "Error",
                    data: {},
                    message: "Unable to send reminder, try again later",
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
exports.GuestListController = GuestListController;
