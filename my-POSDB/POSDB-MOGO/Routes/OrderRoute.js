const express=require('express')
const route=express.Router()
const OrderController=require('../Controllers/OrderController.js')
const Auth=require('../Middlewares/AuthMiddleware.js')
route.get('/GetOrders',Auth,OrderController.getOrder)
route.post('/create',Auth,OrderController.postOrder)
route.get("/orders/:email",OrderController.GetUserOrders)
module.exports=route