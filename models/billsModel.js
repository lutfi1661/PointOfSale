import mongoose from "mongoose";

const billsSchema = new mongoose.Schema({

    customerName: { type: String, required: true },
    customerPhone: { type: Number},
    customerAddress: { type: String},
    subTotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    tax: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    cartItems: { type: Array, required: true }

}, {
    timestamps: true
});

const Bills = mongoose.model("Bills", billsSchema);
export default Bills;