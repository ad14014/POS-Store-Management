
const AllproducttSchema=require('../Models/Allproduct.js')
const Allcategory=require('../Models/Allcategory.js')
const AllInventery=require('../Models/AllInventory.js')

const AllvarientSchema=require('../Models/AllProductVarient.js')

exports.GetAllproduct = async (req, res) => {
  try {
   
    const Allproduct = await AllproducttSchema.find()
      .populate("category","name");
     
      

   
    const allVariants = await AllvarientSchema.find();

    
    const formattedProducts = Allproduct.map(product => {
      const productVariants = allVariants.filter(
        variant => variant.product_id.toString() === product._id.toString()
      );

      return {
        _id: product._id,
        productName: product.productName,
        sku: product.sku,
        description: product.description,
        category:product.category?.name,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        price: product.price || 0,
          image:product.image,
        variants: productVariants.map(v => ({
          _id: v._id,
          variant_name: v.variant_name,
          variant_value: v.variant_value,
          sku: v.sku,
          price: v.price
        }))
      };
    });

    res.status(200).json({
      message: 'All Product',
      Data: formattedProducts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 exports.DeleteProducts=async(req,res)=>{
    try {
        const id=req.params.id;
        const DeleteProducts=await AllproducttSchema.findByIdAndDelete(id)
        res.status(200).json({Data:DeleteProducts})
    } catch (error) {
         res.status(500).json({error:error.message})
    }
 }

exports.UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, sku, description, categoryId, price, image, variants } = req.body;

    // ✅ Update product fields
    const updateFields = {
      productName,
      sku,
      description,
      price,
      image,
      updatedAt: new Date(),
    };
    if (categoryId) updateFields.category = categoryId;

    const updatedProduct = await AllproducttSchema.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    // ✅ Get existing variants from DB
    const existingVariants = await AllvarientSchema.find({ product_id: updatedProduct._id });
    const incomingIds = variants?.map(v => v._id?.toString()).filter(Boolean) || [];

    // ✅ Find variants that should be deleted
    const variantsToDelete = existingVariants.filter(v => !incomingIds.includes(v._id.toString()));

    // Delete variants + inventory
    for (let delVariant of variantsToDelete) {
      await AllvarientSchema.findByIdAndDelete(delVariant._id);
      await InventorySchema.deleteOne({ productVariant: delVariant._id });
     
    }

    // ✅ Process (update or create) variants
    if (Array.isArray(variants)) {
      for (let variant of variants) {
        if (!variant.variant_name || !variant.variant_value) {
          console.warn(`⚠️ Skipping variant with missing name/value:`, variant);
          continue;
        }

        let savedVariant;

        if (variant._id) {
          // Update existing variant
          savedVariant = await AllvarientSchema.findByIdAndUpdate(
            variant._id,
            {
              variant_name: variant.variant_name,
              variant_value: variant.variant_value,
              sku: variant.sku || '',
              price: variant.price,
              refundable: variant.refundable ?? false,
              product_id: updatedProduct._id,
            },
            { new: true, runValidators: true }
          );
        } else {
          // Create new variant
          savedVariant = await AllvarientSchema.create({
            variant_name: variant.variant_name,
            variant_value: variant.variant_value,
            sku: variant.sku || '',
            price: variant.price,
            refundable: variant.refundable ?? false,
            product_id: updatedProduct._id,
          });
        }

        // ✅ Sync Inventory
        if (savedVariant) {
          let existingInventory = await AllInventery.findOne({
            productVariant: savedVariant._id,
          });

          if (!existingInventory) {
            await AllInventery.create({
              product: updatedProduct._id,
              productVariant: savedVariant._id,
              quantity: variant.quantity ?? 0,
              location: variant.location || "Main", // required
              lastUpdated: new Date(),
            });
          
          } else {
            if (typeof variant.quantity === "number") {
              existingInventory.quantity = variant.quantity;
            }
            if (variant.location) {
              existingInventory.location = variant.location;
            }
            existingInventory.lastUpdated = new Date();
            await existingInventory.save();
       
          }
        }
      }
    }

    res.status(200).json({
      message: "✅ Product, variants, and inventory updated successfully",
      data: updatedProduct,
    });

  } catch (error) {
    console.error("❌ UpdateProduct error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

exports.SingleProduct = async (req, res) => {
  try {
    const id = req.params.id;

    
    const product = await AllproducttSchema.findById(id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

  
    const variants = await AllvarientSchema.find({ product_id: product._id });

    const formattedProduct = {
      _id: product._id,
      productName: product.productName,
      sku: product.sku,
      description: product.description,
      category: product.category._id || null, 
      categoryName: product.category.name || "",
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      image: product.image,
      variants: variants.map(v => ({
        _id: v._id,
        variant_name: v.variant_name,
        variant_value: v.variant_value,
        sku: v.sku,
        price: v.price,
        refundable: v.refundable
      }))
    };

    res.status(200).json({ message: formattedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.CreateProduct = async (req, res) => {
  try {
    const { productName, sku, description, categoryId, price, variants } = req.body;

    // ✅ Check category exists
    const category = await Allcategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: `Category with ID '${categoryId}' not found` });
    }

    // ✅ Create product
    const NewProduct = await AllproducttSchema.create({
      productName,
      sku,
      description,
      price,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      category: category._id,
    });

    // ✅ Handle multiple variants
    const createdVariants = [];
    for (const v of variants) {
      const newVariant = await AllvarientSchema.create({
        product_id: NewProduct._id,
        variant_name: v.variant_name,
        variant_value: v.variant_value,
        price: v.price,
        sku: v.sku,
        refundable: v.refundable,
      });

      // ✅ Create inventory for this variant
      await AllInventery.create({
        quantity: v.quantity,
        location: v.location,
        product: NewProduct._id,
        productVariant: newVariant._id,
        lastUpdated: Date.now(),
      });

      createdVariants.push(newVariant);
    }

    res.status(201).json({
      message: "Product created successfully",
      product: NewProduct,
      variants: createdVariants,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

