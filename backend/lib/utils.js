import jwt from "jsonwebtoken"
//function to generate a token for a user

export const generatetoken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET);
   return token;
}