"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestList = void 0;
class GuestList {
    constructor(uuid, name, invitationQty, hasKids, hasConfirmed, invitationId, phoneNumber, adultsNo, kidsNo, message, createdAt, updatedAt, deletedAt) {
        this.uuid = uuid;
        this.name = name;
        this.invitationQty = invitationQty;
        this.hasKids = hasKids;
        this.hasConfirmed = hasConfirmed;
        this.invitationId = invitationId;
        this.phoneNumber = phoneNumber;
        this.adultsNo = adultsNo;
        this.kidsNo = kidsNo;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
exports.GuestList = GuestList;
