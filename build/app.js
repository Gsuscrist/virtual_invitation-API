"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const signale_1 = require("signale");
const invitationRoute_1 = require("./infrastructure/route/invitationRoute");
const guestListRoute_1 = require("./infrastructure/route/guestListRoute");
const webhookRouter_1 = require("./infrastructure/route/webhookRouter");
const app = (0, express_1.default)();
const signale = new signale_1.Signale();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 8080;
app.use('/health', (req, res) => {
    res.status(200).send({
        status: "Success",
        data: [],
        message: "Health ok!"
    });
});
app.use('/webhook', webhookRouter_1.webhookRouter);
app.use('/invitation', invitationRoute_1.invitationRoute);
app.use('/guests', guestListRoute_1.guestListRoute);
app.listen(PORT, () => {
    signale.success(`Server is running on port ${PORT}`);
});
