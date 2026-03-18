const express = require('express');
const router = express.Router();
const controlles = require("../controlles/productcontrolles");
const upload = require("../utils/multer");
// const { Auth } = require('../middlewares/isAuth');   // ← Comment for now
// const isAdmin = require('../middlewares/isAdmin');

router.get('/', controlles.GetProducts);
router.get("/:id", controlles.GetOneProduct);

// Only this route needs upload + protection later
router.post("/", upload.single("image"), controlles.AddProduct);   // ← Removed Auth & isAdmin for testing

// Keep protection on update & delete if you want
router.patch("/:id", upload.single("image"), controlles.UpdateProduct);
router.delete("/:id", controlles.DeleteProduct);

module.exports = router;
