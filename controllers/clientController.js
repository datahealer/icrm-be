import Client from "../models/Client.js";
import APIFeatures from "../utils/apiFeatures.js";
import { body, validationResult } from "express-validator";
import validator from "validator";

export const getAllClients = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Client.find(),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const clients = await features.query;

    res.status(200).json({
      status: "success",
      results: clients.length,
      data: { 
        clients,
      },
    });
  } catch (error) {
    console.log("Error occurred", error);
    next(error);
  }
};

export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!client) {
      return res.status(404).json({
        status: "fail",
        message: "Client not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        client,
      },
    });
  } catch (error) {
    console.log("Error occurred", error);
    next(error);
  }
};

export const createClient = [
  // Validation middleware
  body("primaryContactPerson")
    .notEmpty()
    .withMessage("Primary Contact Person is required"),
  body("billingContactPerson")
    .notEmpty()
    .withMessage("Billing Contact Person is required"),
  body("billingToEmail")
    .isEmail()
    .withMessage("Invalid email format for billingToEmail"),
  body("billingCcEmail")
    .isEmail()
    .withMessage("Invalid email format for billingCcEmail"),
  body("businessName").notEmpty().withMessage("Business Name is required"),
  body("displayName").notEmpty().withMessage("Display Name is required"),
  body("primaryContactNumber")
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage("Invalid primary contact number format"),
  body("gstin")
    .optional()
    .matches(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/)
    .withMessage("Invalid GSTIN format"),
  body("serviceStartDate")
    .isISO8601()
    .toDate()
    .withMessage("Invalid service start date"),
  body("serviceEndDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid service end date"),
  body("paymentTerms").notEmpty().withMessage("Payment Terms are required"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }

    try {
      const newClient = await Client.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          client: newClient,
        },
      });
    } catch (error) {
      console.log("Error occurred", error);
      next(error);
    }
  },
];

export const updateClient = [
  // Validation middleware
  body("primaryContactPerson")
  .notEmpty()
  .withMessage("Primary Contact Person is required"),
body("billingContactPerson")
  .notEmpty()
  .withMessage("Billing Contact Person is required"),
body("billingToEmail")
  .isEmail()
  .withMessage("Invalid email format for billingToEmail"),
body("billingCcEmail")
  .isEmail()
  .withMessage("Invalid email format for billingCcEmail"),
body("businessName").notEmpty().withMessage("Business Name is required"),
body("displayName").notEmpty().withMessage("Display Name is required"),
body("primaryContactNumber")
  .matches(/^\+[1-9]\d{1,14}$/)
  .withMessage("Invalid primary contact number format"),
body("gstin")
  .optional()
  .matches(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/)
  .withMessage("Invalid GSTIN format"),
body("serviceStartDate")
  .isISO8601()
  .toDate()
  .withMessage("Invalid service start date"),
body("serviceEndDate")
  .optional()
  .isISO8601()
  .toDate()
  .withMessage("Invalid service end date"),
body("paymentTerms").notEmpty().withMessage("Payment Terms are required"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", errors: errors.array() });
    }

    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!client || client.isDeleted) {
        return res.status(404).json({
          status: "fail",
          message: "Client not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          client,
        },
      });
    } catch (error) {
      console.log("Error occurred", error);
      next(error);
    }
  },
];

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        status: "fail",
        message: "Client not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log("Error occurred", error);
    next(error);
  }
};

export const getExistingPrefixes = async (req, res) => {
  try {
    const clients = await Client.find({});
    const existingPrefixes = clients.map((client) => client.invoicePrefix);

    const uniquePrefixes = [...new Set(existingPrefixes)];

    return res.status(200).json({
      message: "Users retrieved successfully",
      prefixes: uniquePrefixes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch prefixes",
      error: error.message,
    });
  }
};
