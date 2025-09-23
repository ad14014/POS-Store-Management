const express=require('express')
const route=express.Router()
const AllNumberController=require('../Controllers/AllNumberControlller.js')
route.get('/numbers',AllNumberController.getAllNumber)
module.exports=route