const DiscountSchema = require('../Models/AllDiscount.js')
exports.GetDiscount = async(req,res)=>{
    try {
        const Alldiscount = await DiscountSchema.find().populate('variant_id')
        res.status(200).json({message:'All discount',Data:Alldiscount});

    } catch (error) {
          res.status(500).json({message:error.message});
    }
}

exports.PostDiscount = async (req, res) => {
  try {
    const { name, type, value, variant_id } = req.body;

    if (!name || !type || !value || !variant_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDiscount=await DiscountSchema.create(req.body)



    res.status(201).json({
      message: "Discount created successfully",
      Data: newDiscount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};