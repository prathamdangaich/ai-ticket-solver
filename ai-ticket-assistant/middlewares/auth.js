import jwt from "jsonwebtoken"

export const authenticate = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1]         //Bearer tokenvalue123

    if(!token){
        console.log("No token found in request");
        return res.status(401).json({error: "Access Denied. No token found"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log("User authenticated:", decoded._id);
        req.user = decoded
        next()
    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(401).json({error: "Invalid Token"})
    }
}

