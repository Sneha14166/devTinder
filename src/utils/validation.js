const validator=require("validator");
const validateSignUpData=(req) =>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName ){
        throw new Error("Name is not valid !!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Incorrect email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password too weak");
    }
};
module.exports={
    validateSignUpData,
};