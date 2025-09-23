const mongoose=require('mongoose')

const OrderSchema=new mongoose.Schema({
    cartItems:{type:Object,require:true},
    address:{type:String},
    amount:{type:String},
    customerName:{type:String},
    customerEmail: { type: String, required: true },
    date:{type:Date},
    paymentMode:{type:String},
    phoneNumber:{type:Number},
    status:{type:String},
    postedBy:{type:String},
    totalPrice:{type:String}
},{collection:"Order"})
module.exports=mongoose.model('Order',OrderSchema)