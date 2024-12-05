import mongoose from "mongoose";
import { getCodeList } from "country-list";

const { Schema, model } = mongoose;
const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
const countries = getCodeList();
const iso2Codes = Object.keys(countries);

const clientSchema = new Schema(
  {
    acquisitionPersonId: {
      type: Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    primaryContactPerson: {
      type: String,
      required: true,
    },
    l2ContactPerson: {
      type: String,
      match: /^[A-Za-z\s-]+$/,
      message:
        "l2ContactPerson should not contain numbers or symbols except hyphen.",
    },
    billingContactPerson: {
      type: String,
      required: true,
    },
    billingToEmail: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    billingCcEmail: {
      type: String,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    businessName: {
      type: String,
      required: true,
    },
    displayName: String,
    email: {
      type: String,
    },
    primaryContactNumber: {
      type: String,
      required: true,
    },
    secondaryContactNumber: String,
    gstTreatment: {
      type: String,
      enum: [
        "REGISTERED",
        "REGISTERED_COMPOSITION",
        "UNREGISTERED",
        "CONSUMER",
        "OVERSEAS",
        "SEZ",
      ],
      required: true,
    },
    gstin: {
      type: String,
      validate: {
        validator: function (value) {
          if (
            this.gstTreatment === "REGISTERED" ||
            this.gstTreatment === "REGISTERED_COMPOSITION"
          ) {
            return gstinRegex.test(value);
          }
          return true;
        },
        message: (props) => `${props.value} is not a valid GSTIN format.`,
      },
    },
    serviceAgreementFolderUrl: {
      type: String,
      required: true,
      match: [
        /^(https?:\/\/[^\s$.?#].[^\s]*|www\.[^\s$.?#].[^\s]*|ftp:\/\/[^\s$.?#].[^\s]*)$/,
        "Please provide a valid URL.",
      ],
    },
    ndaFolderUrl: {
      type: String,
      match: [
        /^(https?:\/\/[^\s$.?#].[^\s]*|www\.[^\s$.?#].[^\s]*|ftp:\/\/[^\s$.?#].[^\s]*)$/,
        "Please provide a valid URL.",
      ],
    },

    placeOfSupply: {
      type: String,
      required: true,
      enum: [
        "OT",
        "AP",
        "AR",
        "AS",
        "BR",
        "CT",
        "GA",
        "GJ",
        "HR",
        "HP",
        "JH",
        "KA",
        "KL",
        "MP",
        "MH",
        "MN",
        "ML",
        "MZ",
        "NL",
        "OR",
        "PB",
        "RJ",
        "SK",
        "TN",
        "TG",
        "TR",
        "UP",
        "UK",
        "WB",
        "AN",
        "CH",
        "DH",
        "DL",
        "JK",
        "LA",
        "LD",
        "PY",
      ],
    },
    taxPreference: {
      type: String,
      enum: ["TAXABLE", "TAX_EXEMPT"],
      required: true,
    },
    openingBalance: {
      type: Number,
      default: 0,
      required: true,
    },
    serviceStartDate: {
      type: Schema.Types.Date,
      required: true,
    },
    serviceEndDate: {
      type: Schema.Types.Date,
      required: false,
    },
    paymentTerms: {
      type: String,
      enum: ["DUE_ON_RECEIPT", "NET30"],
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: [
        "UPWORK",
        "LINKEDIN",
        "EXTERNAL_LEAD",
        "SUBSIDIARY",
        "REFERRENCE",
        "ZOOMINFO",
        "PERSONAL_NETWORK",
        "COGNISM",
      ],
    },
    sowFolderUrl: {
      type: String,
      match: [
        /^(https?:\/\/[^\s$.?#].[^\s]*|www\.[^\s$.?#].[^\s]*|ftp:\/\/[^\s$.?#].[^\s]*)$/,
        "Please provide a valid URL.",
      ],
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    address: String,
    country: {
      type: String,
      required: true,
      enum: iso2Codes,
    },
    state: {
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
      required: true,
    },

    receivingAccount: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receivingCurrency: {
      type: String,
      enum: [
        "INR",
        "USD",
        "AUD",
        "NZD",
        "SGD",
        "AED",
        "OMR",
        "GBP",
        "EUR",
        "CAD",
      ],
      required: true,
    },
    invoiceCurrency: {
      type: String,
      enum: [
        "INR",
        "AUD",
        "USD",
        "NZD",
        "SGD",
        "AED",
        "OMR",
        "GBP",
        "EUR",
        "CAD",
      ],
      required: true,
    },
    invoicePrefix: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceFrequency: {
      type: String,
      enum: [
        "WEEKLY_EVERY_MONDAY",
        "MONTHLY_DAY_AFTER_LAST_SUNDAY",
        "MONTHLY_DAY_AFTER_FIRST_SUNDAY",
        "MONTHLY_DAY_AFTER_THIRD_SUNDAY",
        "MONTHLY_DAY_AFTER_FOURTH_SUNDAY",
        "MONTHLY_DAY_AFTER_SECOND_SUNDAY",
        "FORTNIGHTLY_FIRST_AND_THIRD_MONDAY",
        "FORTNIGHTLY_SECOND_AND_FOURTH_MONDAY",
        "FORTNIGHTLY_MONDAY_EVEN_WEEKS",
        "FORTNIGHTLY_MONDAY_ODD_WEEKS",
      ],
      required: true,
    },
    invoiceDelivery: {
      type: String,
      enum: ["AUTOMATIC_TO_EMAIL", "AUTOMATIC_VIA_ASANA", "MANUAL"],
      required: true,
    },
    invoiceFollowupPlan: {
      type: String,
      enum: ["7_15", "15_20", "25_30"],
      required: true,
    },
    invoiceDisplayCurrencies: {
      type: [String],
      enum: [
        "INR",
        "USD",
        "AUD",
        "NZD",
        "SGD",
        "AED",
        "OMR",
        "GBP",
        "EUR",
        "CAD",
      ],
      default: [],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Client = model("Client", clientSchema);

export default Client;
