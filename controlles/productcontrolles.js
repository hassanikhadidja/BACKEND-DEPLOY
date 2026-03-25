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
        const id = req.params.id;

        // If a new image file was uploaded, update it first separately
        if (req.file) {
            await Product.findByIdAndUpdate(id, { img: req.file.path });
        }

        // Update all other body fields (name, price, description etc.)
        // Only spread body fields that are not empty strings
        const updateFields = {};
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== '' && req.body[key] !== undefined) {
                updateFields[key] = req.body[key];
            }
        });

        if (Object.keys(updateFields).length > 0) {
            await Product.findByIdAndUpdate(id, updateFields, { new: true });
        }

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
