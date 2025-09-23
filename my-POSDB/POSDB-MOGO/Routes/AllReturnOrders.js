const express=require('express')
const route=express.Router()
const Auth=require('../Middlewares/AuthMiddleware.js')
const AllreturnOrderController=require('../Controllers/AllReturnController.js')
route.get('/orders/:email',AllreturnOrderController.GetCustomersOrders)
route.get('/get/AllReturn',AllreturnOrderController.GetAllcustomerEmail)
route.post('/create/return',AllreturnOrderController.CreateReturn)
route.put("/update-status/:returnId", AllreturnOrderController.updateReturnStatus);
route.get("/all",AllreturnOrderController.getAllReturnOrders);
route.get("/customer/:email",AllreturnOrderController.getReturnOrdersByEmail);
module.exports=route