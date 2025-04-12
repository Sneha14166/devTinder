const express=require("express");
const authRouter=express.Router();
const {validateSignUpData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const User=require("../models/user");
require('dotenv').config();

authRouter.post("/signup", async(req, res)=>{
    try{
    //validation of data
    validateSignUpData(req);

    const {firstName, lastName, emailId, password}=req.body;

    //encrypt the password
    const passwordHash=await bcrypt.hash(password, 10);

    //creating a new instance of the user model
    const user=new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("Oops, Error encountered:" + err.message);
    }
});

authRouter.post("/login", async(req, res)=>{
    try{
        const {emailId, password}=req.body;
        const user=await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid=user.validatePassword(password);
        if(isPasswordValid){

            //create JWT token
            const token =await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000), 
            });

            res.send("Login successful!");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
    });
    res.send("Logged out successfully");
});
module.exports=authRouter;