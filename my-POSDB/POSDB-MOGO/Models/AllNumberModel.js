const mongoose=require('mongoose')
const NumberSchema=new mongoose.Schema({
    phoneNumber:{type:Number,require:true}
},{collection:"Numbers"})
module.exports=mongoose.model('Number',NumberSchema)