import mongoose from "mongoose";

const { Schema, model } = mongoose;

const purchaseItemSchema = new Schema({
  itemImage: {
    type: String,
    required: true,
  },
  invoiceImage: {
    type: String,
    required: true,
  },
  // isService: {
  //   type: Boolean,
  //   required: true,
  // },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "People",
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  type: {
    type: String,
  },
  unitType: {
    type: String,
    enum: [
      "Hours",
      "Kilos",
      "Grams",
      "Meters",
      "Feets",
      "Bags",
      "Rolls",
      "Sheets",
      "Visits",
      "Sessions",
      "Deliveries",
    ],
  },
  rate: {
    type: Number,
  },
  description: {
    type: String,
  },
  purchaseAccount: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
  },
  salesAccount: {
    type: String,
    required: true,
  },
  tax: {
    type: String,
    enum: [
      "None",
      "Exempt-IGST-0",
      "IGST-0",
      "IGST-0.25",
      "IGST-3",
      "IGST-5",
      "IGST-6",
      "IGST-12",
      "IGST-18",
      "IGST-28",
      "Exempt-GST-0",
      "GST-0",
      "GST-0.25",
      "GST-3",
      "GST-5",
      "GST-6",
      "GST-12",
      "GST-18",
      "GST-28",
    ],
  },
  hsn: {
    type: String,
  },
  sac: {
    type: String,
  },
  totalGst: {
    type: Number,
  },
  amountWoGst: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
});

const PurchaseItem = model("PurchaseItem", purchaseItemSchema);

export default PurchaseItem;
