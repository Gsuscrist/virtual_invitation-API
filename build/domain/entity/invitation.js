"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invitation = exports.EVENT_METADATA_MAP = exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["BIRTHDAY"] = "BIRTHDAY";
    EventType["ANNIVERSARY"] = "ANNIVERSARY";
    EventType["BAPTISM"] = "BAPTISM";
    EventType["WEDDING"] = "WEDDING";
    EventType["COMMUNION"] = "COMMUNION";
    EventType["GRADUATION"] = "GRADUATION";
    EventType["ENGAGEMENT"] = "ENGAGEMENT";
    EventType["BACHELOR"] = "BACHELOR";
    EventType["BABYSHOWER"] = "BABYSHOWER";
    EventType["CORPORATE"] = "CORPORATE";
    EventType["WORKSHOP"] = "WORKSHOP";
    EventType["GENDERREVEAL"] = "GENDERREVEAL";
    EventType["XV"] = "XV";
    EventType["OTHER"] = "OTHER";
})(EventType || (exports.EventType = EventType = {}));
exports.EVENT_METADATA_MAP = {
    [EventType.BIRTHDAY]: {
        description: "el cumpleaños", // p. ej. "mi cumpleaños"
        urlPrefix: "miCumple" // p. ej. "mibirthday"
    },
    [EventType.ANNIVERSARY]: {
        description: "el aniversario",
        urlPrefix: "miAniversario"
    },
    [EventType.BAPTISM]: {
        description: "el bautismo",
        urlPrefix: "miBautismo"
    },
    [EventType.WEDDING]: {
        description: "la boda",
        urlPrefix: "miBoda"
    },
    [EventType.COMMUNION]: {
        description: "la comunión",
        urlPrefix: "miComunion"
    },
    [EventType.GRADUATION]: {
        description: "la graduación",
        urlPrefix: "miGraduacion"
    },
    [EventType.ENGAGEMENT]: {
        description: "el compromiso",
        urlPrefix: "miCompromiso"
    },
    [EventType.BACHELOR]: {
        description: "la despedida",
        urlPrefix: "miDespedida"
    },
    [EventType.BABYSHOWER]: {
        description: "el baby shower",
        urlPrefix: "miBabyShower"
    },
    [EventType.CORPORATE]: {
        description: "el evento",
        urlPrefix: "miEvent"
    },
    [EventType.WORKSHOP]: {
        description: "el taller",
        urlPrefix: "miTaller"
    },
    [EventType.GENDERREVEAL]: {
        description: "la revelación de genero",
        urlPrefix: "miRevelacion"
    },
    [EventType.XV]: {
        description: "los XV años",
        urlPrefix: "misXV"
    },
    [EventType.OTHER]: {
        description: "el evento",
        urlPrefix: "miEvento"
    }
};
class Invitation {
    constructor(uuid, credentials, honoreeName, eventDate, eventType, confirmationDeadLine, phoneNumber, honoreeCode, guestList, deletedAt) {
        this.uuid = uuid;
        this.credentials = credentials;
        this.honoreeName = honoreeName;
        this.eventDate = eventDate;
        this.eventType = eventType;
        this.confirmationDeadLine = confirmationDeadLine;
        this.phoneNumber = phoneNumber;
        this.honoreeCode = honoreeCode;
        this.guestList = guestList;
        this.deletedAt = deletedAt;
    }
}
exports.Invitation = Invitation;
