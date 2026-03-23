const Product=require("../models/product")


exports.AddProduct=async(req,res)=>{
    try {

      // dev =>  const url = `${req.protocol}://${req.get("host")}/${req.file.path}`
             // dev => product.img=url
          const product= new Product(req.body)
           product.img=req.file.path;
            await product.save()
           return res.status(201).send({msg:"product added"})
    } catch (error) {
        return res.status(503).send({msg:error.message})
    }
}

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