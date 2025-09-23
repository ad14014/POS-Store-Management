const AllVarientSchema = require('../Models/AllProductVarient.js');
const product = require('../Models/Allproduct.js')

exports.getAllVarient = async (req, res) => {
   try {
        const allVarient = await AllVarientSchema.find()
        .populate({ path:'product_id',
            populate:{ path:'category'}
        })
        

        const formattedVarient = allVarient.map(varient => (
            {
                productName: varient?.product_id?.productName,
                _id: varient?._id,
                    category_id:varient?.product_id?.category?._id,
               product_Id:varient?.product_id?._id,
                varientName: varient?.variant_name,
                variantValue: varient?.variant_value,
                category:varient?.product_id?.category?.name,
                created_at: varient?.product_id?.createdAt,
                updated_at: varient?.product_id?.updatedAt,
                sku: varient?.sku,
                price: varient?.price,
                refundable:varient?.refundable
}
        ))



        res.status(200).json({
            message: "success",
            data: formattedVarient
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.updateVariantProduct = async (req, res) => {
  try {
    const variantId = req.params.id;
    const { product_id, sku, price, variant_name, variant_value, refundable } = req.body;

    // Validate product_id
    if (!product_id) {
      return res.status(400).json({ message: "product_id is required" });
    }

    // Build update object
    const updatedData = {
      variant_name,
      variant_value,
      product_id,
      sku,
      price,
      refundable: refundable ?? false
    };

    // Update variant
    const updatedVariant = await AllVarientSchema.findByIdAndUpdate(
      variantId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedVariant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.status(200).json({ message: "Variant successfully updated", data: updatedVariant });

  } catch (error) {
    console.error("Update variant error:", error);
    res.status(500).json({ message: "Failed to update variant", error: error.message });
  }
};


exports.createVarient = async (req, res) => {
  try {
    const { productName,
      sku,
      price,
      variant_name,
      variant_value,
      refundable } = req.body;

    const Products = await product.findOne({ productName: productName })
    if (!Products) {
      res.status(404).json({ message: "Product is not define" })
    }
    const ProductVarient = await AllVarientSchema.create({
      variant_name,
      variant_value,
      product_id: Products._id,
      sku,
      price,
      refundable
    })
    return res.status(201).json({
      message: "success",
      data: ProductVarient
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}

exports.deleteVarient = async (req, res) => {
    try {
        const varientId = req.params.id
        const deleteVarient = await AllVarientSchema.findByIdAndDelete(varientId)
        if (!deleteVarient) { res.status(404).json({ message: `product with this ID:${varientId} is not found ` }) }
        res.status(201).json({ message: `product with this ID:${varientId} is deleted ` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

exports.DeleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AllVarientSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error("DeleteVariant error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
