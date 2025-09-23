require('dotenv').config()
const express=require('express');
const App=express()
const bodyParser = require("body-parser");
const cors=require('cors')
const AllNumberRoute=require('./Routes/AllNumberRoute.js')
const AllUserRoute=require('./Routes/AllUserRoute.js')
const AllProductRoute=require('./Routes/AllproductRoute')
const AllCategoriesRoute=require('./Routes/AllCategoris.js')
const AllvarientRoute=require('./Routes/AllVarientRoute.js')
const AllCartRoutes = require('./Routes/cartRoutes.js')
const AllOrderRoutes=require('./Routes/OrderRoute.js')
const AllInventoryRoutes=require('./Routes/AllInventoryRoutes.js')
const AllDiscountRoute=require('./Routes/AllDiscount.js')
const AllreturnRoute=require('./Routes/AllReturnOrders.js')
const PORT=process.env.PORT||3000;
const mongoose=require('mongoose')
App.use(express.json())
App.use(cors())
App.use(bodyParser.json());
App.use('/user',AllUserRoute)
App.use('/',AllProductRoute)
App.use('/category',AllCategoriesRoute)
App.use('/vareint',AllvarientRoute)
App.use('/cart',AllCartRoutes)
App.use('/order',AllOrderRoutes)
App.use('/Inventory',AllInventoryRoutes)
App.use('/discount',AllDiscountRoute)
App.use('/getnumber',AllNumberRoute)
App.use('/return',AllreturnRoute)

App.use('/',(req,res)=>{
    res.status(200).json({message:'Your code is running'})
    console.log("Your code is running");
    
})
const ConnectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection is Successfull!!");
        
    } catch (error) {
     console.log("Not able to connect!!");
        
    }
}
ConnectDB();
App.listen(PORT,()=>{
    console.log(`Your Code is running on Port:${PORT}`);
    
})