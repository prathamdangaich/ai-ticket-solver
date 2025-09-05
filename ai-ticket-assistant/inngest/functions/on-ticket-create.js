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
            //If no related skill is found
            await Ticket.findByIdAndUpdate(ticket._id, {
            priority: "medium", // safe default
            helpfulNotes: "",
            status: "IN_PROGRESS",
            relatedSkills: []
            });
            console.log("AI failed → Ticket still set to IN_PROGRESS with fallback values.");
            }
        return skills;
       });
        
        //Assign moderator
        const moderator = await step.run("assign-moderator", async () => {
            let user = null;

            if (relatedSkills.length > 0) {
                // First try to find a moderator with ALL required skills
                user = await User.findOne({ 
                    role: "moderator",
                    skills: { $all: relatedSkills }
                });

                // If no moderator has all skills, find the one with the most matching skills
                if (!user) {
                    const moderators = await User.find({ role: "moderator" });
                    let bestMatch = null;
                    let maxMatches = 0;

                    for (const moderator of moderators) {
                        const matchingSkills = moderator.skills.filter(skill => 
                            relatedSkills.some(requiredSkill => 
                                skill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
                                requiredSkill.toLowerCase().includes(skill.toLowerCase())
                            )
                        );
                        
                        if (matchingSkills.length > maxMatches) {
                            maxMatches = matchingSkills.length;
                            bestMatch = moderator;
                        }
                    }

                    user = bestMatch;
                }
            }

            // 🔥 Always fallback to admin if no suitable moderator or no related skills
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