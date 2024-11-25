import mongoose from "mongoose";

import { Schema, model } from "mongoose";

const itemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["DEPRECIABLE_ASSET", "CONSUMABLES", "OPERATIONAL_EXPENSE"],
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  depreciationRate: {
    type: Number,
  },
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const Item = model("Item", itemSchema);
export default Item;
