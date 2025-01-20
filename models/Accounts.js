import mongoose from "mongoose";

const  { Schema, model } = mongoose;

const accountSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    purpose: {
      type: String,
    },
    type: {
      type: String,
      enum: ["EXPENSES", "TREASURY", "SAVINGS", "WALLET"],
    },
    bankAccount: {
      type: String,
      required: [true, "Bank account is required"],
      validate: {
        validator: function (value) {
          return /^[A-Za-z]{3}_[0-9]{4}$/.test(value); // Regular expression for validation
        },
        message:
          "Bank account must start with 3 letters, followed by an underscore (_), and 4 digits.",
      },
    },
    ifscCode: {
      type: String,
    },
    currency: {
      type: String,
    },
    branch: {
      type: String,
    },
    swiftCode: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Accounts = model("Accounts", accountSchema);

