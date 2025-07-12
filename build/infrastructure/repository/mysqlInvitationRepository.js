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
exports.MysqlInvitationRepository = void 0;
const invitation_1 = require("../../domain/entity/invitation");
const credentials_1 = require("../../domain/entity/credentials");
const prisma_1 = require("../../../generated/prisma");
const guestList_1 = require("../../domain/entity/guestList");
const signale_1 = require("signale");
const dependencies_1 = require("../dependencies");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const axios_1 = __importDefault(require("axios"));
const prisma = new prisma_1.PrismaClient();
const signale = new signale_1.Signale();
class MysqlInvitationRepository {
    constructor() {
        this.whatsappToken = process.env.WHATSAPP_TOKEN || '';
        this.metaVersion = process.env.META_VERSION || '';
        this.phoneId = process.env.PHONE_ID || '';
    }
    getEventMetadata(eventType) {
        const metadata = invitation_1.EVENT_METADATA_MAP[eventType];
        if (!metadata) {
            return { description: "el evento", urlPrefix: "miEvento" };
        }
        return metadata;
    }
    getGuestConfigData(guest) {
        return __awaiter(this, void 0, void 0, function* () {
            let phoneNumber = guest.phone;
            let honoree = guest.honoree;
            let contactNumber = guest.contact;
            let { description, urlPrefix } = this.getEventMetadata(guest.event);
            let urlPostfix = `/${urlPrefix}/${guest.honoreeCode}/${guest.id}`;
            let data = JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": `52${phoneNumber}`,
                "type": "template",
                "template": {
                    "name": "virtual_invitation",
                    "language": {
                        "code": "es_MX"
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": `${description}`
                                },
                                {
                                    "type": "text",
                                    "text": `${honoree}`
                                },
                                {
                                    "type": "text",
                                    "text": `https://invitaciones-virtuales.com.mx${urlPostfix}`
                                },
                                {
                                    "type": "text",
                                    "text": `${contactNumber}`
                                }
                            ]
                        }
                    ]
                }
            });
            return {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://graph.facebook.com/${this.metaVersion}/${this.phoneId}/messages`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.whatsappToken}`
                },
                data: data
            };
        });
    }
    delete(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invitationDelete = yield prisma.invitation.update({
                    where: {
                        uuid: uuid,
                        AND: { deleted_at: null }
                    },
                    data: {
                        deleted_at: new Date()
                    }
                });
                signale.success("connection successful");
                return !!invitationDelete;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    getInvitationBy(honoreeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invitation = yield prisma.invitation.findUnique({
                    where: {
                        honoreeCode: honoreeCode,
                        AND: { deleted_at: null }
                    },
                    include: { guestList: true }
                });
                signale.success("connection successful");
                if (invitation) {
                    const credentials = new credentials_1.Credentials(invitation.username, invitation.password);
                    const guestList = invitation.guestList.map(guest => {
                        return new guestList_1.GuestList(guest.uuid, guest.name, guest.invitation_qty, guest.hasKids, guest.hasConfirmed, guest.invitationId, guest.phoneNumber, guest.adultsNo, guest.kidsNo, guest.message, guest.deleted_at);
                    });
                    return new invitation_1.Invitation(invitation.uuid, credentials, invitation.honoreeName, invitation.eventDate, invitation.eventType, invitation.confirmationDeadline, invitation.phoneNumber, invitation.honoreeCode, guestList);
                }
            }
            catch (e) {
                console.error(e);
            }
            return null;
        });
    }
    getInvitation(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invitation = yield prisma.invitation.findUnique({
                    where: {
                        uuid: uuid,
                        AND: { deleted_at: null }
                    },
                    include: { guestList: true }
                });
                signale.success("connection successful");
                if (invitation) {
                    const credentials = new credentials_1.Credentials(invitation.username, invitation.password);
                    const guestList = invitation.guestList.map(guest => {
                        return new guestList_1.GuestList(guest.uuid, guest.name, guest.invitation_qty, guest.hasKids, guest.hasConfirmed, guest.invitationId, guest.phoneNumber, guest.adultsNo, guest.kidsNo, guest.message, guest.deleted_at);
                    });
                    return new invitation_1.Invitation(uuid, credentials, invitation.honoreeName, invitation.eventDate, invitation.eventType, invitation.confirmationDeadline, invitation.phoneNumber, invitation.honoreeCode, guestList);
                }
            }
            catch (e) {
                console.error(e);
            }
            return null;
        });
    }
    signIn(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invitation = yield prisma.invitation.findUnique({
                    where: {
                        username: credentials.username,
                        AND: { deleted_at: null }
                    },
                    include: { guestList: true }
                });
                if (invitation) {
                    if (yield dependencies_1.encryptService.compare(credentials.password, invitation.password)) {
                        signale.success("Connection successful");
                        const guestList = invitation.guestList.map(guest => {
                            return new guestList_1.GuestList(guest.uuid, guest.name, guest.invitation_qty, guest.hasKids, guest.hasConfirmed, guest.invitationId, guest.phoneNumber, guest.adultsNo, guest.kidsNo, guest.message, guest.deleted_at);
                        });
                        return new invitation_1.Invitation(invitation.uuid, credentials, invitation.honoreeName, invitation.eventDate, invitation.eventType, invitation.confirmationDeadline, invitation.phoneNumber, invitation.honoreeCode, guestList);
                    }
                }
                return null;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    signUp(credentials, honoreeName, eventDate, eventType, confirmationDeadLine, phoneNumber, honoreeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let uid = new short_unique_id_1.default({ length: 6 });
                let uuid = uid.rnd();
                const invitationSign = yield prisma.invitation.create({
                    data: {
                        uuid: uuid,
                        username: credentials.username,
                        password: credentials.password,
                        honoreeName: honoreeName,
                        eventDate: eventDate,
                        eventType: eventType,
                        confirmationDeadline: confirmationDeadLine,
                        phoneNumber: phoneNumber,
                        honoreeCode: honoreeCode
                    }
                });
                signale.success("connection successful");
                return !!invitationSign;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    update(uuid, invitation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedInvitation = yield prisma.invitation.update({
                    where: { uuid: uuid },
                    data: {
                        honoreeName: invitation.honoreeName,
                        eventDate: invitation.eventDate,
                        eventType: invitation.eventType,
                        confirmationDeadline: invitation.confirmationDeadLine,
                        phoneNumber: invitation.phoneNumber,
                    }
                });
                signale.success("connection successful");
                if (updatedInvitation) {
                    return invitation;
                }
                return null;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    sendInvitations(honoreeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invitation = yield this.getInvitationBy(honoreeCode);
                if (!invitation) {
                    signale.warn(`Invitation with honoreeCode ${honoreeCode} not found`);
                    return false;
                }
                const guests = invitation.guestList;
                if (!guests || guests.length === 0) {
                    signale.warn(`No guests found for invitation ${honoreeCode}`);
                    return false;
                }
                let allSent = true;
                for (const guest of guests) {
                    const guest_data = {
                        id: guest.uuid,
                        phone: guest.phoneNumber,
                        event: invitation.eventType,
                        honoree: invitation.honoreeName,
                        contact: invitation.phoneNumber,
                        honoreeCode: invitation.honoreeCode,
                    };
                    const config = yield this.getGuestConfigData(guest_data);
                    try {
                        const response = yield axios_1.default.request(config);
                        if (response.status !== 200) {
                            signale.error(`Failed to send to ${guest.phoneNumber}: status ${response.status}`);
                            allSent = false;
                        }
                        else {
                            signale.success(`Invitation sent to ${guest.phoneNumber}`);
                        }
                    }
                    catch (requestError) {
                        signale.error(`Error sending to ${guest.phoneNumber}: ${requestError}`);
                        allSent = false;
                    }
                }
                return allSent;
            }
            catch (e) {
                console.error(`Unexpected error in sendInvitations:`, e);
                return false;
            }
        });
    }
}
exports.MysqlInvitationRepository = MysqlInvitationRepository;
