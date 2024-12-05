import mongoose from "mongoose";
import Project from "./Project.js";

const { Schema, model } = mongoose;

// Schema for Services
const serviceSchema = new Schema({
  name: {
    type: String,
  },

  fromDate: Date,
  toDate: Date,

  hours: {
    type: Number,
  },
  rate: {
    type: Number,
  },
  discountPercent: Number,
  discountAmount: {
    type: Number,
  },
  sac: {
    type: String,
  },
  timeTrackerReportUrl: {
    type: String,
  },
  taxableAmount: {
    type: Number,
  },
  sgstRate: {
    type: String,
  },
  sgstAmount: {
    type: Number,
  },
  cgstRate: {
    type: String,
  },
  cgstAmount: {
    type: Number,
  },
  igstRate: {
    type: String,
  },
  igstAmount: {
    type: Number,
  },
  state: {
    type: String,
    enum: ["Uttar Pradesh", "Others"],
  },
});

// Schema for Adjustments
const adjustmentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  amount: {
    type: Number,
  },
});

// Main Schema
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: mongoose.Schema.Types.Number,
    },
    invoiceDate: {
      type: mongoose.Schema.Types.Date,
    },
    paymentLink: {
      type: mongoose.Schema.Types.String,
    },
    dueDate: {
      type: mongoose.Schema.Types.Date,
    },
    amountReceived: {
      type: mongoose.Schema.Types.Number,
    },
    previousDues: {
      type: mongoose.Schema.Types.Number,
    },
    currency: {
      type: mongoose.Schema.Types.String,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      //  ,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    invoiceAmount: {
      type: Number,
    },
    poNumber: String,

    serviceFromDate: Date,
    serviceToDate: Date,
    mileStones: {},
    serviceDays: {
      type: Number,
      required: false,
      default: function () {
        if (this.serviceFromDate && this.serviceToDate) {
          const diffTime = Math.abs(this.serviceToDate - this.serviceFromDate);
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return 0;
      },
    },
    dueDate: {
      type: Date,
    },
    paymentLink: String,
    doc: {
      type: Number,
    },
    preparedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "People",
      },
      name: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    reviewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "People",
      },
    ],
    services: {
      type: [serviceSchema],
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "FINALIZED",
        "IN_REVIEW",
        "REVIEWED_APPROVED",
        "REVIEWED_CHANGE_REQUESTED",
        "DUE",
        "PAID",
        "PART_PAID_PART_DUE",
        "PART_PAID_PART_FORGIVEN",
        "FORGIVEN",
        "CANCELLED_OR_VOID",
        "AMOUNT_RECEIVED",
      ],
    },

    paidAmount: Number,
    forgivenAmount: Number,
    paidAmountINR: Number,
    forgivenReason: String,
    cancellationReason: String,
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
    lostAmountINR: Number,
  },
  { timestamps: true }
);

const Invoice = model("Invoice", invoiceSchema);

export default Invoice;
