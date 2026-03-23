const Product=require("../models/product")


exports.AddProduct = async (req, res) => {
  try {
    const product = new Product(req.body);

    // ─── Safety check ──────────────────────────────
    if (req.file) {
      product.img = req.file.path;          // local path
      // or → product.img = req.file.filename;   // usually better
      // or → upload to cloudinary (see below)
    } else {
      // Optional: product.img = "default-product.jpg" or leave empty
    }

    await product.save();
    return res.status(201).json({ msg: "product added", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
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


exports.UpdateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update only if a new file was uploaded
    if (req.file) {
      product.img = req.file.path;
      // or cloudinary version
    }

    // Apply the rest of the body fields
    Object.assign(product, req.body);

    await product.save();

    return res.status(200).json({ 
      msg: "Update success",
      product 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
};

console.log("Has file? →", !!req.file);
if (req.file) {
  console.log("File info →", {
    originalname: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
} else {
  console.log("No file received. Content-Type:", req.headers["content-type"]);
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