import {Credentials} from "./credentials";
import {GuestList} from "./guestList";

export type EventMetadata = {
    description: string;
    urlPrefix: string;
};


export enum EventType {
    BIRTHDAY = "BIRTHDAY",
    ANNIVERSARY = "ANNIVERSARY",
    BAPTISM = "BAPTISM",
    WEDDING = "WEDDING",
    COMMUNION = "COMMUNION",
    GRADUATION = "GRADUATION",
    ENGAGEMENT = "ENGAGEMENT",
    BACHELOR = "BACHELOR",
    BABYSHOWER = "BABYSHOWER",
    CORPORATE = "CORPORATE",
    WORKSHOP = "WORKSHOP",
    GENDERREVEAL = "GENDERREVEAL",
    XV = "XV",
    OTHER = "OTHER"
}

export const EVENT_METADATA_MAP: Record<EventType, EventMetadata> = {
    [EventType.BIRTHDAY]: {
        description: "el cumpleaños", // p. ej. "mi cumpleaños"
        urlPrefix: "miCumple"    // p. ej. "mibirthday"
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

export class Invitation {
    constructor(
        readonly uuid: string,
        readonly credentials: Credentials,
        readonly honoreeName: string,
        readonly eventDate: Date,
        readonly eventType: EventType,
        readonly confirmationDeadLine: Date,
        readonly phoneNumber: string,
        readonly honoreeCode:string,
        readonly guestList?: GuestList[],
        readonly deletedAt?: Date|null
    ) {
    }
}