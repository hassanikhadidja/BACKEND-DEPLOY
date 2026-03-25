// controlles/productcontrolles.js
const Product    = require("../models/product");
const cloudinary = require("../config/cloudinary");

// ─── Helper: upload buffer to Cloudinary ───────────────────────
// memoryStorage gives us req.file.buffer (not a path).
// We wrap cloudinary's upload_stream in a Promise so we can await it.
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "jeunes-toys" },          // optional: organise in a folder
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);                   // push the buffer into the stream
  });
};

// ─── ADD ────────────────────────────────────────────────────────
exports.AddProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ msg: "Image file is required" });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    const product = new Product(req.body);
    product.img   = result.secure_url;   // Cloudinary HTTPS URL
    await product.save();

    return res.status(201).send({ msg: "product added" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ─── GET ALL ────────────────────────────────────────────────────
exports.GetProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ─── GET ONE ────────────────────────────────────────────────────
exports.GetOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ─── UPDATE ─────────────────────────────────────────────────────
exports.UpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // If a new image was uploaded, stream it to Cloudinary first
    if (req.file) {
      const result  = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      updateData.img = result.secure_url;
    }

    await Product.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(202).send({ msg: "Update success" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ─── DELETE ─────────────────────────────────────────────────────
exports.DeleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(400).send({ msg: "Bad request" });
    }
    return res.status(202).send({ msg: "product deleted" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};
