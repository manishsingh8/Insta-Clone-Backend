const jwt = require("jsonwebtoken");
const {Jwt_secret} = require("../keys");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");






module.exports =(req,res,next)=>{
    // authorization is used to check the used is signin or not
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error:"You must have logged in"})
    }
    const token = authorization.replace("Bearer ","");//replacying the Bearer  with empty string

    // verify 
    jwt.verify(token,Jwt_secret,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must have logged in 2"})
        }
        const {_id} = payload
        USER.findById(_id).then(userData=>{
            // console.log(userData);
            req.user = userData
            next();//next is used to run the next function after middleware
        })

    })
}