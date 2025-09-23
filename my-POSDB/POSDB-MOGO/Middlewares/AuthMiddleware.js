const JWT=require('jsonwebtoken')
const Protect=async(req,res,next)=>{
    try {
        const token=req.header("Authorization")?.split(" ")[1];
    if(!token)return res.status(400).json({message:"No token has found"});
    const decode=JWT.verify(token,process.env.JSON_TOKEN)
    req.user=decode.id;
   next();
    } catch (error) {
          res.status(500).json({
            success: false,
            message: "Wrong token,Access Denied",
            error: error.message
        });  
    }
    
}
module.exports=Protect