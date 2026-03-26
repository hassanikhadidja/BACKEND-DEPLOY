const Product    = require("../models/product");
const cloudinary = require("../config/cloudinary");

// ── Upload a single buffer to Cloudinary ────────────────────────
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "jeunes-toys" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

// ── Upload all files in req.files in parallel ────────────────────
const uploadAllFiles = async (files) => {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map(f => uploadToCloudinary(f.buffer)));
};

// ─── ADD ─────────────────────────────────────────────────────────
exports.AddProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ msg: "At least one image is required" });
    }

    const urls    = await uploadAllFiles(req.files);
    const product = new Product(req.body);
    product.img   = urls;               // array of Cloudinary URLs
    await product.save();

    return res.status(201).send({ msg: "product added" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ─── GET ALL ─────────────────────────────────────────────────────
exports.GetProducts = async (req, res) => {
  try {
    return res.status(200).json(await Product.find());
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ─── GET ONE ─────────────────────────────────────────────────────
exports.GetOneProduct = async (req, res) => {
  try {
    return res.status(200).json(await Product.findById(req.params.id));
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────
exports.UpdateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      // New images uploaded — replace the entire img array
      updateData.img = await uploadAllFiles(req.files);
    }
    // If no files uploaded — img array stays as-is (not overwritten)

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

// ─── DELETE ──────────────────────────────────────────────────────
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
