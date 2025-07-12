
export class GuestList {
    constructor(
        readonly uuid: string,
        readonly name: string,
        readonly invitationQty: number,
        readonly hasKids: boolean,
        readonly hasConfirmed:boolean,
        readonly invitationId: string,
        readonly phoneNumber?: string|null,
        readonly adultsNo?: number|null,
        readonly kidsNo?: number|null,
        readonly message?: string|null,
        readonly createdAt?: Date|null,
        readonly updatedAt?: Date|null,
        readonly deletedAt?: Date|null

    ) {
    }
}