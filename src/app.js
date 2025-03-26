const express=require('express');

const app=express();
app.use("/hp", (req,res)=>{
    res.send("homepage");
})

app.use("/test",(req, res)=>{
    res.send("Hello from the server");
});

app.listen(3000, ()=>{
    console.log("server started successfully");
});