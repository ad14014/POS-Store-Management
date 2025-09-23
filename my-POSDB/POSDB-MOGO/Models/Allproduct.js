const mongoose=require('mongoose')
const AllproducttSchema=new mongoose.Schema({
    
productId:{type:Number},
productName:{type:String},
sku:{type:String},
description:{type:String},
createdAt:{type:Date},
category:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
updatedAt:{type:Date},
varient_Id:{type:mongoose.Schema.Types.ObjectId,ref:'AllProductVarient'},
image:{type:String}
},{collection:'AllProduct'})
module.exports=mongoose.model('allproduct',AllproducttSchema)