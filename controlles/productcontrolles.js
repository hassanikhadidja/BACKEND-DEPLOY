const Product    = require("../models/product");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "jeunes-toys" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

exports.AddProduct = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ msg: "Image file is required" });
    const result  = await uploadToCloudinary(req.file.buffer);
    const product = new Product(req.body);
    product.img   = result.secure_url;
    await product.save();
    return res.status(201).send({ msg: "product added" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

exports.GetProducts = async (req, res) => {
  try {
    return res.status(200).json(await Product.find());
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

exports.GetOneProduct = async (req, res) => {
  try {
    return res.status(200).json(await Product.findById(req.params.id));
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

exports.UpdateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const result   = await uploadToCloudinary(req.file.buffer);
      updateData.img = result.secure_url;
    }
    await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );
    return res.status(202).send({ msg: "Update success" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(400).send({ msg: "Bad request" });
    return res.status(202).send({ msg: "product deleted" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};
