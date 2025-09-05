import {Inngest} from "inngest"

export const inngest = new Inngest({
    id: "ticketing-system",
    eventKey: process.env.INNGEST_EVENT_KEY,
    signingKey: process.env.INNGEST_SIGNING_KEY,
    isDev: process.env.NODE_ENV !== "production"
})