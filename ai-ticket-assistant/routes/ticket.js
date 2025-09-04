import express from "express"
import { authenticate } from "../middlewares/auth.js"
import { getTickets, getTicket, createTicket, getTicketDetails, deleteTicket } from "../controllers/ticket.js"

const router = express.Router()

router.get("/",authenticate, getTickets)
router.get("/:id",authenticate, getTicket)
router.get("/:id/details",authenticate, getTicketDetails)
router.post("/",authenticate,createTicket)
router.delete("/:id",authenticate, deleteTicket)

export default router