const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
name:{type:String,require:true},
price:{type:Number,require:true},
img:{type:String},
description:{type:String,require:true},
rating:{type:Number,default:0},
stock :{type:Number,require:true},
nbr_commande:{type:Number,default:0} 
},{ timestamps: true })


const product=mongoose.model('product',productSchema)

module.exports=product