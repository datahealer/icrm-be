import mongoose from "mongoose";
import People from "./People.js";
import Project from "./Project.js";
import PurchaseItem from "./PurchaseItems.js";
import User from "./User.js";

const { Schema, model } = mongoose;

let serialNumberCounter = 1;

const serviceSchema = new Schema({
  purchaseItemId: {
    type: Schema.Types.ObjectId,
    ref: "PurchaseItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fromDate: {
    type: Date,
  },
  toDate: {
    type: Date,
  },
  mileStone: {
    type: String,
  },
  hours: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
  },
  discountAmount: {
    type: Number,
  },
  SAC: {
    type: String,
    required: true,
  },
  timeTrackerReportUrl: {
    type: String,
  },
  taxableAmount: {
    type: Number,
    required: true,
  },
  sgstRate: {
    type: String,
    enum: ["Nil", "9"],
    required: true,
  },
  sgstAmount: {
    type: Number,
    required: true,
  },
  cgstRate: {
    type: String,
    enum: ["Nil", "9"],
    required: true,
  },
  cgstAmount: {
    type: Number,
    required: true,
  },
  igstRate: {
    type: String,
    enum: ["Nil", "18"],
    required: true,
  },
  igstAmount: {
    type: Number,
    required: true,
  },
});

const productSchema = new Schema({
  purchaseItemId: {
    type: Schema.Types.ObjectId,
    ref: "PurchaseItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  units: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
  },
  discountAmount: {
    type: Number,
  },
  HSN: {
    type: String,
    required: true,
  },
  proofOfPurchaseUrl: {
    type: String,
    required: true,
  },
  taxableAmount: {
    type: Number,
    required: true,
  },
  sgstRate: {
    type: String,
    enum: ["Nil", "9"],
    required: true,
  },
  sgstAmount: {
    type: Number,
    required: true,
  },
  cgstRate: {
    type: String,
    enum: ["Nil", "9"],
    required: true,
  },
  cgstAmount: {
    type: Number,
    required: true,
  },
  igstRate: {
    type: String,
    enum: ["Nil", "18"],
    required: true,
  },
  igstAmount: {
    type: Number,
    required: true,
  },
});

const adjustmentSchema = new Schema({
  name: {
    type: String,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    enum: [
      "DRAFT",
      "FINALIZED",
      "DUE",
      "PAID",
      "PART_PAID_PART_DUE",
      "PART_PAID_PART_FORGIVEN",
      "FORGIVEN",
      "CANCELLED_OR_VOID",
    ],
  },
});

const purchaseOrderSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    serialNumber: {
      type: Number,
      default: () => serialNumberCounter++,
    },
    number: {
      type: String,
      required: true,
    },
    poNumber: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    purchaseType: {
      type: String,
      enum: ["products", "services", "both"],
      required: true,
    },
    serviceFromDate: {
      type: Date,
    },
    serviceToDate: {
      type: Date,
    },
    mileStones: {
      type: String,
    },
    serviceDays: {
      type: Number,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    preparedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    services: {
      type: [serviceSchema],
      required: function () {
        return this.purchaseType !== "products";
      },
    },
    products: {
      type: [productSchema],
      required: function () {
        return this.purchaseType !== "services";
      },
    },
    adjustments: {
      type: [adjustmentSchema],
      default: [],
    },
    notes: {
      type: String,
    },
    vendorInvoiceUrl: {
      type: String,
    },
    paidAmount: {
      type: Number,
    },
    forgivenAmount: {
      type: Number,
    },
    paidAmountINR: {
      type: Number,
    },
    forgivenReason: {
      type: String,
    },
    cancellationReason: {
      type: String,
    },
    paymentChannel: {
      type: String,
      enum: [
        "WISE",
        "WISE_ACH",
        "XE",
        "UPWORK",
        "AIRWALLEX",
        "PAYPAL",
        "INTERNATIONAL_WIRE",
        "NEFT/UPI",
        "CHEQUE_INR",
        "CASH_INR",
        "CASH_USD",
      ],
    },
  },
  { timestamps: true }
);

const PurchaseOrder = model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
