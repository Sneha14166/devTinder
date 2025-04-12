const express=require("express");
const requestRouter=express.Router();

const {userAuth}=require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", async(req, res)=>{
    res.send("Request sent successfully");
})

module.exports=requestRouter;