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
exports.InvitationUseCase = void 0;
class InvitationUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    signIn(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.signIn(credentials);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    signUp(credentials, honoreeName, eventDate, eventType, confirmationDeadline, phoneNumber, honoreeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.signUp(credentials, honoreeName, eventDate, eventType, confirmationDeadline, phoneNumber, honoreeCode);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    delete(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete(uuid);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    getInvitation(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getInvitation(uuid);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    update(uuid, invitation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.update(uuid, invitation);
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
                return yield this.repository.sendInvitations(honoreeCode);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
}
exports.InvitationUseCase = InvitationUseCase;
