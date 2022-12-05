import express from "express";
import {
  getProductController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController.js";

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./client/public/images/products");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const productRouter = express.Router();

productRouter.get("/getproducts", getProductController);

productRouter.post(
  "/addproducts",
  upload.single("image.0.originFileObj"),
  addProductController
);

productRouter.put(
  "/updateproducts",
  upload.single("newImage.0.originFileObj"),
  updateProductController
);

productRouter.post("/deleteproducts", deleteProductController);

export default productRouter;
