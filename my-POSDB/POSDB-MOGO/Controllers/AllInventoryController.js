const InventorySchema=require('../Models/AllInventory.js')
const Product=require('../Models/Allproduct.js')
const AllVariant=require('../Models/AllProductVarient.js')
exports.GetAllInventoryItems=async(req,res)=>{
    try {
        const InventoryItems=await InventorySchema.find().populate('product','productName').populate('productVariant','variant_name')
        res.status(200).json({Data:InventoryItems})
    } catch (error) {
         res.status(500).json({error:error.message})
    }
}

 exports.CheckInventory=async (req, res) => {
  try {
    const { productId, variantId} = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });

    const variant = await AllVariant.findById(variantId);
    if (!variant) return res.json({ success: false, message: "Variant not found" });

   else {
      return res.json({ success: false, message:"Eorror" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, err:err.message });
  }
};
exports.getInventory = async (req, res) => {
  try {
    const allInventory = await InventorySchema.find()
      .populate({
        path: 'productVariant',
        populate: {
          path: 'product_id',
          populate: { path: 'category' }
        }
      });

const formattedData = allInventory.map((inv)=>({
  _id:inv._id,
  quantity:inv.quantity,
  location:inv.location,
  lastUpdated:inv.lastUpdated,
VariantName:inv.productVariant?.variant_name,
varientValue:inv.productVariant?.variant_value,
productName:inv.productVariant?.product_id?.productName,
category:inv.productVariant?.product_id?.category?.name,


}))

    

    res.status(200).json({ message: "All Inventory", data: formattedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









exports.CreateInventory = async(req,res)=>{
   try {
    
    
    const {quantity,productName,location,variant_name}=req.body
   const variant=await AllVariant.findOne({variant_name:variant_name})
       const Products = await Product.findOne({ productName: productName })
   

    const Inventorydata = await InventorySchema.create(
        {quantity,
             location,
              lastUpdated:Date.now(),
              productVariant:variant._id,
              product:Products._id

});
    res.status(201).json({message:"Added successfully",data:Inventorydata})
   } catch (error) {
     res.status(500).json({error:error.message})
   }
}


exports.UpdateonlyInventory = async(req,res)=>{
     try {
        const ID = req.params.id;
        const {variant_name,quantity,location,productName} = req.body;
const Varient = await AllVariant.findOne({variant_name:variant_name})
  const Products = await Product.findOne({ productName: productName })

const updatedData={
              quantity,
              location,
              lastUpdated:Date.now(),
              productVariant:Varient._id,
              product:Products._id
}

        
 
        const Inventory = await InventorySchema.findByIdAndUpdate(ID, updatedData, { new: true })
        res.status(201).json({ message: "success", data: Inventory })
  } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.UpdateInventory= async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.json({ success: false, message: "Variant not found" });

    if (variant.stock < quantity) {
      return res.json({ success: false, message: "Not enough stock" });
    }

    variant.stock -= quantity;
    await product.save();

    res.json({ success: true, message: "Stock updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

exports.DeleteInventory = async(req,res)=>{
    try {
        const id =req.params.id;
        const deleteInventory = await InventorySchema.findByIdAndDelete(id);
        res.status(200).json({message:"Deleted successfully",data:deleteInventory})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


exports.getSingleInventory = async(req,res)=>{
    try {
        const id = req.params.id
        const singleInventory = await InventorySchema.findById(id).populate({
        path: 'productVariant',
        populate: {
          path: 'product_id',
          populate: { path: 'category' }
        }
      });
const formattedData = {
  _id:singleInventory._id,
  quantity:singleInventory.quantity,
  location:singleInventory.location,
  lastUpdated:singleInventory.lastUpdated,
VariantName:singleInventory.productVariant?.variant_name,
varientValue:singleInventory.productVariant?.variant_value,
productName:singleInventory.productVariant?.product_id?.productName,
category:singleInventory.productVariant?.product_id?.category?.name,


}

res.status(200).json({message:"Single Inventory",data:formattedData}) 
    } catch (error) {
         res.status(500).json({error:error.message})
    }
}
