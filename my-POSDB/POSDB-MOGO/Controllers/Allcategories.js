const AllCategory=require('../Models/Allcategory.js')
 exports.GetAllCategory=async(req,res)=>{
    try {
         const AllCategories=await AllCategory.find()
         res.status(200).json({message:'All Product',Data:AllCategories})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
 }