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
exports.MysqlGuestListRepository = void 0;
const prisma_1 = require("../../../generated/prisma");
const signale_1 = require("signale");
const guestList_1 = require("../../domain/entity/guestList");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const prisma = new prisma_1.PrismaClient();
const signale = new signale_1.Signale();
class MysqlGuestListRepository {
    parseCSV(fileBuffer) {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = stream_1.Readable.from(fileBuffer);
            stream
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                var _a, _b, _c;
                const mappedRow = {
                    name: ((_a = row['Nombre Invitacion']) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                    invitationQty: ((_b = row['Pases']) === null || _b === void 0 ? void 0 : _b.trim()) || '1',
                    hasKids: this.parseBoolean(row['Niños']),
                    phoneNumber: ((_c = row['Telefono']) === null || _c === void 0 ? void 0 : _c.trim()) || '',
                };
                results.push(mappedRow);
            })
                .on('end', () => resolve(results))
                .on('error', reject);
        });
    }
    parseBoolean(value) {
        const v = value === null || value === void 0 ? void 0 : value.toLowerCase().trim();
        return (v === 'sí' || v === 'si' || v === 'yes' || v === 'true') ? 'true' : 'false';
    }
    mapCSVToGuestData(rows, invitationId) {
        const uid = new short_unique_id_1.default({ length: 6 });
        return rows.map(row => ({
            uuid: uid.rnd(),
            name: row.name.trim(),
            invitation_qty: parseInt(row.invitationQty, 10),
            hasKids: row.hasKids.trim().toLowerCase() === 'true',
            phoneNumber: row.phoneNumber.trim(),
            hasConfirmed: false,
            invitationId,
        }));
    }
    confirmAssistance(id, adultsNo, kidsNo, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const preGuest = yield this.getGuestListBy(id);
                if (!preGuest) {
                    return false;
                }
                const invitation = yield prisma.invitation.findUnique({
                    where: {
                        uuid: preGuest.invitationId,
                        AND: { deleted_at: null }
                    }
                });
                if (preGuest.hasConfirmed) {
                    return false;
                }
                const now = new Date();
                if (!invitation || now > invitation.confirmationDeadline) {
                    return false;
                }
                let total_guest = adultsNo + kidsNo;
                if (total_guest > preGuest.invitationQty) {
                    return false;
                }
                const guest = yield prisma.guestList.update({
                    where: { uuid: id, AND: { deleted_at: null } },
                    data: {
                        hasConfirmed: true,
                        adultsNo: adultsNo,
                        kidsNo: kidsNo,
                        message: message
                    }
                });
                signale.success('connection successful');
                return !!guest;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    create(name, invitationQty, hasKids, invitationId, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let uid = new short_unique_id_1.default({ length: 6 });
                let uuid = uid.rnd();
                const guest = yield prisma.guestList.create({
                    data: {
                        uuid: uuid,
                        name: name,
                        invitation_qty: invitationQty,
                        hasKids: hasKids,
                        phoneNumber: phoneNumber,
                        hasConfirmed: false,
                        invitation: {
                            connect: { uuid: invitationId }
                        }
                    }
                });
                signale.success("connection successful");
                return !!guest;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const guest = yield prisma.guestList.update({
                    where: { uuid: id },
                    data: {
                        deleted_at: new Date()
                    }
                });
                return !!guest;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    getGuestListBy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const guest = yield prisma.guestList.findUnique({
                    where: { uuid: id,
                        AND: { deleted_at: null } }
                });
                if (guest) {
                    return new guestList_1.GuestList(id, guest.name, guest.invitation_qty, guest.hasKids, guest.hasConfirmed, guest.invitationId, guest.phoneNumber, guest.adultsNo, guest.kidsNo, guest.message, guest.deleted_at);
                }
                return null;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    getGuestListOf(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const guestList = yield prisma.guestList.findMany({
                    where: {
                        invitationId: invitationId,
                        AND: {
                            deleted_at: null
                        }
                    }
                });
                return guestList.map(guest => {
                    return new guestList_1.GuestList(guest.uuid, guest.name, guest.invitation_qty, guest.hasKids, guest.hasConfirmed, guest.invitationId, guest.phoneNumber, guest.adultsNo, guest.kidsNo, guest.message, guest.deleted_at);
                });
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    update(id, guestList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedGuest = yield prisma.guestList.update({
                    where: { uuid: id, AND: { deleted_at: null } },
                    data: {
                        name: guestList.name,
                        invitation_qty: guestList.invitationQty,
                        hasKids: guestList.hasKids,
                    }
                });
                signale.success('connection successful');
                if (updatedGuest) {
                    return guestList;
                }
                return null;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    createMany(buffer, invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.parseCSV(buffer);
                const data = this.mapCSVToGuestData(rows, invitationId);
                if (data.length > 0) {
                    const guestList = yield prisma.guestList.createMany({ data });
                    return !!guestList;
                }
                return false;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    sendReminder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
exports.MysqlGuestListRepository = MysqlGuestListRepository;
