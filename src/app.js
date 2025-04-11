const express=require('express');
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");

app.use(express.json());


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

//get user by email
app.get("/user", async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const user=await User.findOne({emailId:userEmail});
        if(user.length === 0){
            res.status(404).send("User not found")
        }
        else res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});

//feed api - get /feed - get all the users from the database
app.get("/feed", async (req, res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});

//delete api call
app.delete("/user", async(req, res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch (err){
        res.status(400).send("something went wrong");
    }
});

//update data of the user
app.patch("/user", async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;

    try{
    const ALLOWED_UPDATES=[
        "userId", "photoURL", "about", "gender", "age", "skills"
    ];

    const isUpdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
    );

    if(!isUpdateAllowed){
        throw new Error("Update Not Allowed for this field");
    }

    if(data?.skills.length>10){
        throw new Error("Skills cannot be more than 10");
    }

        const user=await User.findByIdAndUpdate({_id: userId}, data, {runValidators:true,});
        res.send("User updated successfully");
    }
    catch(err){
        res.status(400).send("Update failed:" + err.message);
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
