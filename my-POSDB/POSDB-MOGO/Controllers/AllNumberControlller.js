const AllNumberSchema=require('../Models/AllNumberModel.js')
exports.getAllNumber=async(req,res)=>{
    const response=await AllNumberSchema.find()
    res.status(200).json({data:response})
}