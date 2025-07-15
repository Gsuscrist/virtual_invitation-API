import express from 'express';
import {Response,Request} from 'express';
import cors from 'cors';
import {Signale} from 'signale';
import {invitationRoute} from "./infrastructure/route/invitationRoute";
import {guestListRoute} from "./infrastructure/route/guestListRoute";
import {webhookRouter} from "./infrastructure/route/webhookRouter";

const app = express();
const signale = new Signale();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 8080;


app.use('/health', (req: Request, res: Response) => {
    res.status(200).send({
        status: "Success",
        data: [],
        message: "Health ok!"
    });
});

app.use('/webhook',webhookRouter)
app.use('/invitation',invitationRoute)
app.use('/guests',guestListRoute)

app.listen(PORT, () => {
    signale.success(`Server is running on port ${PORT}`);
})