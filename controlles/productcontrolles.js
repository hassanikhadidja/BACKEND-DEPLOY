const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");   // Make sure path is correct
const fs = require("fs");

exports.AddProduct = async (req, res) => {
    try {
        console.log("📥 Request Body:", req.body);   // For debugging
        console.log("📸 File Received:", req.file);

        if (!req.file) {
            return res.status(400).json({ msg: "Image is required" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "toys_products",
        });

        // Delete temp file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        const imageUrl = result.secure_url;

        const productData = {
            name: req.body.name,
            sku: req.body.sku ? req.body.sku.toUpperCase().trim() : "DEFAULT-SKU",
            price: parseFloat(req.body.price) || 0,
            img: imageUrl,
            images: [imageUrl],
            description: req.body.description || "No description provided",
            ageRange: {
                min: parseInt(req.body.ageMin) || 0,
                max: parseInt(req.body.ageMax) || 12,
            },
            isEducational: req.body.isEducational === "true",
            stock: parseInt(req.body.stock) || 0,
            category: req.body.category,
            tags: req.body.tags ? req.body.tags.split(",").map(s => s.trim()) : [],
        };

        const product = new Product(productData);
        await product.save();

        return res.status(201).json({
            msg: "Product added successfully",
            product
        });

    } catch (error) {
        console.error("❌ AddProduct Error:", error);
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error.message
        });
    }
};

exports.GetProducts=async(req,res)=>{
    try {
          const products= await Product.find()
           return res.status(200).json(products)
    } catch (error) {
        return res.status(503).send({msg:error.message})
    }
}

exports.GetOneProduct=async(req,res)=>{
    try {
          const product= await Product.findById(req.params.id)
           return res.status(200).json(product)
    } catch (error) {
        return res.status(503).send({msg:error.message})
    }
}

exports.UpdateProduct=async(req,res)=>{
    try {
        
        if (req.file)
        { 
            // dev=>const url = `${req.protocol}://${req.get("host")}/${req.file.path}`
       const   product=await Product.findById(req.parms.id)
           //  dev=> product.img=url
           product.img=req.file.path;
         await product.save()
    }
    const {body}=req
    await Product.findByIdAndUpdate(req.params.id,body,{new:true})
        
       return res.status(202).send({msg:"Update success"})
    } catch (error) {
        return res.status(503).send({msg:error.message})
    }
}

exports.DeleteProduct=async(req,res)=>{
    try {
        const result= await Product.deleteOne({_id:req.params.id})
        if(result.deletedCount==0){
            return res.status(400).send({msg:"Bad request"})
        }
       return res.status(202).send({msg:"product deleted"})
    } catch (error) {
        return res.status(503).send({msg:error.message})
    }
}