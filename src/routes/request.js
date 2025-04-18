const express=require("express");
const requestRouter=express.Router();

const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req, res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid Status Type");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send("This user does not even exist");
        }

        //if there is existing request in schema
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId,},
                {fromUserId: toUserId, toUserId: fromUserId,},
            ],
        });
        if(existingConnectionRequest){
            res.status(400).send("Connection request already exists");
        }

        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data=await connectionRequest.save();
        const actionMessage = status === "interested"
            ? `showed interest in ${toUser.firstName}`
            : `ignored ${toUser.firstName}`;

        res.send(`${req.user.firstName} has ${actionMessage}`);
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req, res)=>{
    try{
        const loggedInUser=req.user;
        const {status, requestId}=req.params;
        const allowedStatus=["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error("Status not allowed");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if(!connectionRequest){
            res.status(400).send("Connection request not found")
        }
        connectionRequest.status=status;

        const data=await connectionRequest.save();
        res.send("Connection request " + status);
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports=requestRouter;