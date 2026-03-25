const Product = require("../models/product");

exports.AddProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        product.img = req.file.path;
        await product.save();
        return res.status(201).send({ msg: "product added" });
    } catch (error) {
        return res.status(503).send({ msg: error.message });
    }
};

exports.GetProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(503).send({ msg: error.message });
    }
};

exports.GetOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(503).send({ msg: error.message });
    }
};

exports.UpdateProduct = async (req, res) => {
    try {
        // Build the update object from the request body
        const updateData = { ...req.body };

        // BUG FIX 1: was req.parms.id (typo) — crashed when a file was uploaded
        // BUG FIX 2: image was saved separately then overwritten by findByIdAndUpdate
        // FIX: merge img directly into updateData so one single update handles everything
        if (req.file) {
            updateData.img = req.file.path;
        }

        // BUG FIX 3: previous code did findByIdAndUpdate(id, body) AFTER saving img
        // separately — the body didn't include img so the image change was lost
        await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

        return res.status(202).send({ msg: "Update success" });
    } catch (error) {
        return res.status(503).send({ msg: error.message });
    }
};

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