const mongoose=require('mongoose');
const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://sneha12a14166:@namastenode.dd04m.mongodb.net/devTinder"
    );
};

module.exports=connectDB;
