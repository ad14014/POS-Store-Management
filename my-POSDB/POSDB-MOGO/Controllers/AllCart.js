const AllCartProducts = require('../Models/AllCartProducts.js');
const InventorySchema=require('../Models/AllInventory.js')

exports.postCart= async (req,res)=>{


    try {
        const {categoryName,
description,
price,
productName,
quantity,
selectedVariant,
sku,
variants}=req.body
const CheckInventory=await InventorySchema.findOne({productVariant:selectedVariant._id})



if(!CheckInventory)return res.status(500).json({message:"Variant not found"});
if(CheckInventory.quantity<quantity)return res.status(500).json({message:"This Product is not available right now!!"});

        const NewCartproduct=await AllCartProducts.create({
            categoryName,

description,
price,
productName,
quantity,
selectedVariant,
sku,
variants})
 CheckInventory.quantity = CheckInventory.quantity - quantity;
    CheckInventory.lastUpdated = new Date();
    await CheckInventory.save();

    res.status(200).json({ data:NewCartproduct})
} catch (error) {
    console.log(error.message);
            res.status(500).json({ message: error.message})
    }
}
exports.GetCartProducts=async(req,res)=>{
    try {
        const GetAllCartProducts=await AllCartProducts.find()
        res.status(200).json({Data:GetAllCartProducts})
    } catch (error) {
         res.status(500).json({ message: error.message})
    }
}