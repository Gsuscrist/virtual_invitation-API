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
exports.GuestListUseCase = void 0;
class GuestListUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    create(name, invitationQty, hasKids, invitationId, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.create(name, invitationQty, hasKids, invitationId, phoneNumber);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    getGuestListOf(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getGuestListOf(invitationId);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    getGuestListBy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getGuestListBy(id);
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
                return yield this.repository.update(id, guestList);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete(id);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    confirmAssistance(id, adultsNo, kidsNo, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.confirmAssistance(id, adultsNo, kidsNo, message);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    sendReminder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.sendReminder(id);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    createMany(buffer, invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createMany(buffer, invitationId);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
}
exports.GuestListUseCase = GuestListUseCase;
