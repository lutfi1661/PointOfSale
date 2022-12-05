import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import fileUpload from "express-fileupload";
// import bb from "express-busboy";
import productRouter from "./routes/productsRoutes.js";
import userRouter from "./routes/userRoutes.js";
import billsRouter from "./routes/billsRoutes.js";

dotenv.config();

//Connect with MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

// kontol
// app.use(
//   fileUpload({
//     createParentPath: true,
//   })
// );

// bb.extend(app, {
//   upload: true,
//   path: "./client/public/images/products/",
//   allowedPath: /./,
// });

//middlewares
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

//routes
app.use("/api/products/", productRouter);
app.use("/api/users/", userRouter);
app.use("/api/bills/", billsRouter);

//Create Port
const PORT = process.env.PORT || 5000;

//Listen
app.listen(PORT, () => {
  console.log(`Serve at running on the port: http://localhost:${PORT}`);
});
