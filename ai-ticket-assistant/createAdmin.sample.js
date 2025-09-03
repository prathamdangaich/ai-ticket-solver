// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "example@abc";              //Your Admin email
    const plainPassword = "abcdefghijkl";    //Your Admin Password

    // hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // create the admin user
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      skills: [],
      createdAt: new Date(),
    });

    console.log("Admin user created:", admin);
    process.exit(0);
    
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
