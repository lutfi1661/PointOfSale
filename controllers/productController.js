import Product from "../models/productModel.js";
import fs from "fs";

//for add or fetch
export const getProductController = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

//for add
export const addProductController = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
    //   console.error("Ini error");
    //   console.info();

      const body = Object.assign({}, req.body);
    //   console.log("body");

      const newData = {
        name: body.name,
        category: body.category,
        subcategory: body.subcategory,
        status: body.status,
        price: body.price,
        image: `/images/products/${req.file.filename}`,
      };
      console.log(newData);
      const newProducts = new Product(newData);
      await newProducts.save();
      res.status(200).send("Products Created Successfully!");
    }
  } catch (error) {
    console.log(error);
  }
};

//for update
export const updateProductController = async (req, res) => {
  try {
    // console.log("body update", req.body);
    const body = Object.assign({}, req.body);

    const data = {
      name: body.name,
      category: body.category,
      subcategory: body.subcategory,
      status: body.status,
      price: body.price,
    };

    if (!req.file) {
      await Product.findOneAndUpdate({ _id: body.productId }, data, {
        new: true,
      });
    } else {
      const product = await Product.findOne({ _id: body.productId });
      try {
        fs.unlinkSync(`./client/public/${product.image}`);
      } catch (err) {
        console.error(err);
      }

      try {
        await Product.findOneAndUpdate(
          { _id: body.productId },
          {
            ...data,
            image: `/images/products/${req.file.filename}`,
          },
          {
            new: true,
          }
        );
      } catch (err) {
        console.log(err);
      }
      console.log(product.image);
    }

    res.status(201).json("Product Updated!");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//for delete
export const deleteProductController = async (req, res) => {
  try {
    try {
      const product = await Product.findOne({ _id: req.body.productId });
      try {
        fs.unlinkSync(`./client/public/${product.image}`);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.log(err);
    }
    await Product.findOneAndDelete({ _id: req.body.productId });
    res.status(200).json("Product Deleted!");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
