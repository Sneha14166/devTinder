const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async(req, res)=>{
    try{
    const user=req.user;
    res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
        if(!validateEditProfileData(req.body)){
            throw new Error("Invalid edit request");
        }
        const loggedInUser=req.user;

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

        await loggedInUser.save();

        res.send(`${loggedInUser.firstName} Profile Updated Successfully!`);
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send("Old and new passwords are required.");
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).send("Old password is incorrect.");
        }

        user.password = newPassword;
        await user.save();

        res.send("Password updated successfully.");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports=profileRouter;