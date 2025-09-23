const express=require('express')
const route=express.Router()
const AllCategoriescontroller=require('../Controllers/Allcategories.js')
const Auth=require('../Middlewares/AuthMiddleware.js')
route.get('/getAll',AllCategoriescontroller.GetAllCategory)
module.exports=route