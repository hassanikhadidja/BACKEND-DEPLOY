const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
name:{type:String,require:[true, 'Le nom du produit est obligatoire']},
sku:{type:String,require:[true, 'Le code SKU est obligatoire']}, // Example: ENT-SAND-001, ENT-BALL-002, etc.
price:{type:Number,require:[true, 'Le prix est obligatoire'], min: [0, 'Le prix ne peut pas être négatif']},
img:[
  {
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "product image",
    }
  }
],
description:{type:String,require:[true, 'La description est obligatoire']},
age_plus: {
      type: Number,
      min: 0,
      default: 3,
      required: [true, "L'âge minimum recommandé est obligatoire"]
    },
// Educational value
isEducational: {
      type: Boolean,
      default: false
    },
// Category & tags
    category: {
      type: String,
      enum: [
        'plastic toys',
        'building sets',
        'vehicles',
        'dolls & accessories',
        'educational toys',
        'outdoor play',
        'pretend play',
        'puzzles & games',
        'baby & toddler',
        'other'
      ],
      default: 'plastic toys',
      required: true
    },
tags: [{
      type: String,
      trim: true
    }],
// Sizes / variants (very useful for toys)
    sizes: [{
      type: String,
      enum: ['small', 'medium', 'large', 'standard', 'one-size'],
      default: ['standard']
    }],

rating:{type:Number,default:0,min: 0,
      max: 5},
stock :{type:Number,require:[true, 'Le stock est obligatoire']},
nbr_commande:{type:Number,default:0} 
},{ timestamps: true })// createdAt & updatedAt


const product=mongoose.model('product',productSchema)

module.exports=product