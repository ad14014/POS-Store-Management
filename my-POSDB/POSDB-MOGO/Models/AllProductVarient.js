const mongoose = require('mongoose');

const varientSchema= new mongoose.Schema({
product_id:{ type:mongoose.Schema.Types.ObjectId, ref:'allproduct'},
variant_name:{ type:String, required:true},
variant_value:{type:String, required:true},
sku:{type:String, required:true},
price:{type:Number, required:true},
refundable:{type:Boolean,require:true}
},{collection:"AllProductVarient"})

module.exports= mongoose.model("AllProductVarient",varientSchema)