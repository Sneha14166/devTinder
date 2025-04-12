const express=require('express');
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
require('dotenv').config();
const {userAuth}=require("./middlewares/auth");

app.use(express.json()); 
app.use(cookieParser());

app.post("/signup", async(req, res)=>{
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

app.post("/login", async(req, res)=>{
    try{
        const {emailId, password}=req.body;
        const user=await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){

            //create JWT token
            const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn : "1d"});

            // console.log(token);

            //add the token to cookie and send the response back to the user
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

app.get("/profile", userAuth, async(req, res)=>{
    try{
    const user=req.user;
    res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

app.post("/sendConnectionRequest", async(req, res)=>{

})

connectDB().then(()=>{
    console.log("database connection established");
    app.listen(7777, ()=>{
        console.log("server started successfully");
    });
}).catch(err=>{
    console.log("database cannot be connected");
});
