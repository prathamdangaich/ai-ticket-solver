import jwt from "jsonwebtoken"
import User from "../models/user.js";

export const authenticate = async (req, res, next) => {
    try {
         const token = req.headers.authorization?.split(" ")[1]         //Bearer tokenvalue123
        if(!token){
            console.log("No token found in request");
            return res.status(401).json({error: "Access Denied. No token found"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log("User authenticated:", decoded._id);

        const userFromDB = await User.findById(decoded.id || decoded._id);
        if (!userFromDB) {
            return res.status(401).json({ message: "User not found" });
        }

         req.user = {
            ...userFromDB._doc,        // all user fields
            _id: userFromDB._id        // ensure _id is present as ObjectId
        };

        next()

    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(401).json({error: "Invalid Token"})
    }
}
















// middlewares/auth.js
// import jwt from "jsonwebtoken";
// import User from "../models/user.js"; // make sure the path is correct

// export const authenticate = async (req, res, next) => {
//     try {
//         // Get token from header
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ message: "Unauthorized: No token provided" });
//         }

//         const token = authHeader.split(" ")[1];

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Fetch user from DB to attach full user info if needed
//         const user = await User.findById(decoded.id || decoded._id).select("-password"); 
//         if (!user) {
//             return res.status(401).json({ message: "Unauthorized: User not found" });
//         }

//         // Attach user to request
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("Auth middleware error:", error);
//         return res.status(401).json({ message: "Unauthorized: Invalid token" });
//     }
// };
