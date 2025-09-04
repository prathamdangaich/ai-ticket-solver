import express from "express"
import { authenticate } from "../middlewares/auth.js"
import { getTickets, getTicket, createTicket, getTicketDetails } from "../controllers/ticket.js"

const router = express.Router()

router.get("/",authenticate, getTickets)
router.get("/:id",authenticate, getTicket)
router.get("/:id/details",authenticate, getTicketDetails)
router.post("/",authenticate,createTicket)

export default router