const express=require('express')
const route=express.Router()
const CartItems=require('../Controllers/AllCart')
const Auth=require('../Middlewares/AuthMiddleware.js')
route.post("/",Auth,CartItems.postCart)
route.get('/getAll',Auth,CartItems.GetCartProducts)
module.exports=route