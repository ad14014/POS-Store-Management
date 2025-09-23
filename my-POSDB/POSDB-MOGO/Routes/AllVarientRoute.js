const express=require('express')
const route=express.Router()
const AllVarientcontroller=require('../Controllers/AllvarientContoller.js')
const Auth=require('../Middlewares/AuthMiddleware.js')
route.get('/getAll',AllVarientcontroller.getAllVarient)
route.put('/update/:id',AllVarientcontroller.updateVariantProduct)
route.post('/create',Auth,AllVarientcontroller.createVarient)
route.delete('/:id',AllVarientcontroller.deleteVarient)
module.exports=route