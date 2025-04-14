const express=require('express');
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");
require('dotenv').config();
const {userAuth}=require("./middlewares/auth");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");


app.use(express.json()); 
app.use(cookieParser());

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(()=>{
    console.log("database connection established");
    app.listen(7777, ()=>{
        console.log("server started successfully");
    });
}).catch(err=>{
    console.log("database cannot be connected");
});
