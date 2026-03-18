const express=require("express")
const app=express()
require("dotenv").config()
const PORT=process.env.PORT
const connectdb=require("./config/connectDB")
const productRoutes=require("./routes/productRoutes")
const userRoutes=require("./routes/userRoutes")
connectdb()


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(express.urlencoded({ extended: true }));


app.use("/product",productRoutes)
app.use("/user",userRoutes)

app.use((req,res)=>{
    return res.status(404).send("NOT FOUND")
})

app.listen(PORT,()=>console.log("server is running"))