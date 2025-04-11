const express=require('express');
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");

app.use(express.json());

app.post("/signup", async(req, res)=>{
    //creating a new instance of the user model
    const user=new User(req.body);
    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Oops, Error encountered:" + err.message);
    }
});

connectDB().then(()=>{
    console.log("database connection established");
    app.listen(7777, ()=>{
        console.log("server started successfully");
    });
}).catch(err=>{
    console.log("database cannot be connected");
});
