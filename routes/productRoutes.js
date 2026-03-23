const express = require('express');
const router = express.Router();
const controlles=require("../controlles/productcontrolles")
const upload=require("../utils/multer")
const { Auth } = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/',controlles.GetProducts)
router.get("/:id",Auth,controlles.GetOneProduct)

router.post("/",upload.single("file"),Auth,isAdmin,controlles.AddProduct)

router.patch("/:id",upload.single("file"),Auth,isAdmin,controlles.UpdateProduct)

router.delete("/:id",Auth,isAdmin,controlles.DeleteProduct)


module.exports = router;