const mongoose=require('mongoose')
const AllCategory=new mongoose.Schema({
    
name:{type:String,require:true},
description:{type:String,require:true}
},{collection:'Allcategory'})
module.exports=mongoose.model('Category',AllCategory)