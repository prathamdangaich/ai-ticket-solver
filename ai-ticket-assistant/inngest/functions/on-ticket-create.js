import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js"
import User from "../../models/user.js"
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";


export const onTicketCreated = inngest.createFunction(
    {id: "on-ticket-created", retries: 2},
    {event: "ticket/created"},

   async({event, step}) => {
    try {
        const {ticketId} = event.data;

        //fetch ticket from db
        const ticket = await step.run("fetch-ticket", async() => {
            const ticketObject = await Ticket.findById(ticketId)

            if(!ticketObject){
                throw new NonRetriableError("Ticket Not Found")
            }
            return ticketObject;
        })

        // Set initial status TODO
        await step.run("update-ticket-status", async() => {
            await Ticket.findByIdAndUpdate(ticket._id, {status: "TODO"})
        })

       // Analyze ticket with AI
        const aiResponse = await analyzeTicket(ticket)

        
        const relatedSkills = await step.run("ai-processing", async() => {
        let skills = [];
        if(aiResponse){
            await Ticket.findByIdAndUpdate(ticket._id, {
                priority: ["low", "medium", "high"].includes(aiResponse.priority) ? aiResponse.priority : "medium",
                helpfulNotes: aiResponse.helpfulNotes || "",
                status: "IN_PROGRESS",
                relatedSkills: aiResponse.relatedSkills || []
            })
            skills = aiResponse.relatedSkills || [];
            console.log("Ticket updated by AI with IN_PROGRESS status and related skills:", skills);
        }
        else{
            console.log("AI failed or returned no relatedSkills. Ticket stays in TODO.");
        }
        return skills;
       });
        
        //Assign moderator
        const moderator = await step.run("assign-moderator", async () => {
        if (relatedSkills.length === 0) {
            console.log("No relatedSkills → skipping moderator assignment");
            return null;
        }

        let query = { role: "moderator" };
        query.skills = { $elemMatch: { $regex: relatedSkills.join("|"), $options: "i" } };

        let user = await User.findOne(query);
        if (!user) {
            user = await User.findOne({ role: "admin" });
        }

        await Ticket.findByIdAndUpdate(ticket._id, { assignedTo: user?._id || null });
        console.log("Ticket assigned to user:", user?.email || "None");
        return user;
        });


        //Send email
       await step.run("send-email-notification", async() => {
        if(moderator){
            const finalTicket = await Ticket.findById(ticket._id)
            await sendMail(
                moderator.email,
                "Ticket Assigned",
                `A new ticket is assigned to you ${finalTicket.title}`,
            )
        }
       })

       return {success : true}
        
    } catch (error) {
        console.error("❌ Error running the Inngest function:", error);
    return { success: false, message: error.message, stack: error.stack };
    }
   }
)