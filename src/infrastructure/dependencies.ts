import {MysqlInvitationRepository} from "./repository/mysqlInvitationRepository";
import {BCryptService} from "../domain/service/bCryptService";
import {Jwt} from "../application/jwt/jwt";
import {MysqlGuestListRepository} from "./repository/mysqlGuestListRepository";
import {InvitationUseCase} from "../application/useCase/invitationUseCase";
import {InvitationController} from "./controller/invitationController";
import {GuestListUseCase} from "../application/useCase/guestListUseCase";
import {GuestListController} from "./controller/guestListController";

export const invitationDatabase = new MysqlInvitationRepository()
export const encryptService = new BCryptService()
export const jwt = new Jwt()

export const guestListDatabase = new MysqlGuestListRepository()

export const  invitationUseCase = new InvitationUseCase(invitationDatabase)
export const invitationController = new InvitationController(invitationUseCase,jwt,encryptService)

export const guestListUseCase = new GuestListUseCase(guestListDatabase)
export const guestListController = new GuestListController(guestListUseCase)