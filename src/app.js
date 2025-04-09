const express=require('express');

const app=express();

const {adminAuth}=require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("admin/getAllData", (req,res)=>{
    res.send("all data sent");
});

app.get("/user",(req, res)=>{
    res.send({firstname:"Sneha", LastName:"Goel"});
});

app.post("/user",(req,res)=>{
    console.log("Save the data to the database");
    res.send("Data successfully saved to the database");
});

app.delete("/user", (req, res)=>{
    res.send("Deleted successfully");
});

app.use("/test",(req, res)=>{
    res.send("Hello from the server");
});

app.listen(3000, ()=>{
    console.log("server started successfully");
});