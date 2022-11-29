import express from "express";
import { getProductController, addProductController, updateProductController, deleteProductController } from "../controllers/productController.js";
import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: "client/public/images/products",
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
      // file.fieldname is name of the field (image)
      // path.extname get the uploaded file extension
    },
  });

  const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) {
        // upload only png and jpg format
        return cb(new Error("Please upload a Image"));
      }
      cb(undefined, true);
    },
  });


const productRouter = express.Router();

productRouter.get("/getproducts", getProductController);

productRouter.post("/addproducts", imageUpload.single("image"), addProductController);

productRouter.put("/updateproducts", updateProductController);

productRouter.post("/deleteproducts", deleteProductController);

export default productRouter;