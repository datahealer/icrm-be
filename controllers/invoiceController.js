import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import People from "../models/People.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import QRCode from "qrcode";
import numberToWords from "number-to-words";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import APIFeatures from "../utils/apiFeatures.js";
import { auth } from "../middleware/Auth.js";

export const getAllInvoices = async (req, res, next) => {
  try {
    const features = new APIFeatures(Invoice.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    features.query = features.query
      .populate("clientId")
      .populate("projectId")
      .populate("reviewedBy");

    const invoices = await features.query;

    res.status(200).json({
      status: "success",
      results: invoices.length,
      data: {
        invoices,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        invoice,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const {
      invoiceNumber = null,
      invoiceDate = new Date(), // Default to current date if not provided
      dueDate = null,
      amountReceived = 0,
      previousDues = 0,
      currency = "USD", // Default currency if none provided
      business = {},
      project = {},
      paymentLink = "",
      milestones = [],
      items = [],
      status = "DRAFT", // Default status as 'draft'
      preparedBy = {},
      doc,
      sgstAmount,
      cgstAmount,
      igstAmount,
      sgstRate,
      cgstRate,
      igstRate,
    } = req.body;

    // Ensure items is an array to avoid errors when mapping

    const services = Array.isArray(items)
      ? items.map((item) => ({
          name: item?.name || "Unknown Service",
          sac: item?.sac || "",
          hours: item?.hours || 0,
          rate: item?.rate || 0,
          discountAmount: item?.discountAmount || 0,
          taxableAmount: item?.taxableValue || 0,
          sgstAmount,
          cgstAmount,
          igstAmount,
          sgstRate,
          cgstRate,
          igstRate,
        }))
      : [];

    const preparedByData = { ...preparedBy, createdAt: new Date() };

    const invoiceData = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      amountReceived,
      previousDues,
      currency,
      clientId: business.id || null,
      projectId: project.id || null,
      paymentLink,
      mileStones: milestones,
      services,
      status,
      doc,
      preparedBy: preparedByData,
    };

    const newInvoice = await Invoice.create(invoiceData);

    res.status(201).json({
      status: "success",
      data: {
        invoice: newInvoice,
      },
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the invoice.",
      error: error.message || "Unknown error",
    });
  }
};

export const updateInvoice = async (req, res, next) => {
  const { status, reviewedBy } = req.body;
  try {
    const updateData = {
      status,
    };

    if (reviewedBy) {
      updateData.$addToSet = { reviewedBy };
    }
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.invoiceId,
      updateData,
      {
        new: true,
      }
    );

    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        invoice,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const generateInvoiceData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers["email"];

    if (!userEmail) {
      return res.status(401).send({ error: "Email header missing" });
    }

    // Find the invoice by name
    const invoice = await Invoice.findById(id)
      .populate("clientId")
      .populate("projectId")
      .populate("preparedBy")
      .populate("reviewedBy");

    if (!invoice) {
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice not found" });
    }

    const client = await Client.findById(invoice.clientId);

    const project = await Project.findById(invoice.projectId);
    const preparedBy = await People.findById(invoice.preparedBy);
    const reviewedBy = await People.find({ _id: { $in: invoice.reviewedBy } });
    const previousInvoices = await Invoice.find({
      clientId: client._id,
      status: { $ne: "PAID" },
      _id: { $ne: invoice._id },
    });
    const previousDues = previousInvoices.reduce(
      (sum, inv) =>
        sum +
        inv.services.reduce(
          (acc, service) =>
            acc +
            service.taxableAmount +
            service.sgstAmount +
            service.cgstAmount +
            service.igstAmount,
          0
        ),
      0
    );

    // Calculate current charges
    const currentCharges = invoice.services.reduce(
      (acc, service) =>
        acc +
        service.taxableAmount +
        service.sgstAmount +
        service.cgstAmount +
        service.igstAmount,
      0
    );

    // Total amount due in USD and INR
    const totalAmountDueUSD = previousDues + currentCharges;
    const totalAmountDueINR = totalAmountDueUSD * 83.5; // Example conversion rate

    // Generate QR Code (Placeholder)
    // Generate QR Code Data
    const qrData = {
      invoiceNumber: invoice.number,
      clientName: client.businessName,
      amountDue: invoice.services.reduce(
        (acc, service) =>
          acc +
          service.taxableAmount +
          service.sgstAmount +
          service.cgstAmount +
          service.igstAmount,
        0
      ),
      dueDate: invoice.dueDate.toISOString().split("T")[0],
    };

    const qrString = JSON.stringify(qrData);

    // Generate QR Code (Base64 encoded PNG)
    const qrCode = await QRCode.toDataURL(qrString);

    // Format invoice data
    const invoiceData = {
      companyName: "Inzint Private Limited",
      companyAddress: "B-111, Sector 65, Noida, India, 201301",
      companyGSTIN: "09AAFCI7567Q1ZK",
      invoiceNumber: invoice.serialNumber,
      invoiceDate: invoice.date.toISOString().split("T")[0], // Format: YYYY-MM-DD
      dueDate: invoice.dueDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
      currency: client.currency,
      reverseChargeApplicable: "No",
      billedTo: {
        businessName: client.businessName,
        billingContactPerson: client.billingContactPerson,
        address: client.address,
        email: client.email,
        gstin: client.GSTIN,
        placeOfSupply: client.placeOfSupply,
        country: client.country,
      },
      qrCode: qrCode,
      projectName: project.name,
      servicePeriod: `${
        invoice.serviceFromDate.toISOString().split("T")[0]
      } - ${invoice.serviceToDate.toISOString().split("T")[0]}`,
      milestones: invoice.mileStones.join(", "),
      docNumber: invoice.serialNumber,
      poNumber: invoice.poNumber,
      services: invoice.services.map((service, index) => ({
        id: index + 1,
        name: service.name,
        description: service.description,
        fromDate: service.fromDate
          ? service.fromDate.toISOString().split("T")[0]
          : null,
        toDate: service.toDate
          ? service.toDate.toISOString().split("T")[0]
          : null,
        milestone: service.mileStone,
        SAC: service.SAC,
        hours: service.hours,
        rate: service.rate,
        discount: service.discountPercent
          ? `${service.discountPercent}%`
          : service.discountAmount,
        taxableValue: service.taxableAmount,
        sgst: service.sgstAmount,
        cgst: service.cgstAmount,
        igst: service.igstAmount,
        amount:
          service.taxableAmount +
          service.sgstAmount +
          service.cgstAmount +
          service.igstAmount,
      })),
      currentCharges: currentCharges,
      preparedBy: "Imtiyaz",
      preparedByDate: new Date().toISOString(),
      amountReceived: invoice.paidAmount || 0,
      reviewedBy: "Imtiyaz",
      currentDue: currentCharges,
      previousDues: previousDues, // This should be fetched or calculated from historical data
      totalAmountDueUSD: totalAmountDueUSD, // This should be calculated
      totalAmountDueINR: totalAmountDueINR, // This should be calculated
      totalAmountDueUSDWords: `${numberToWords.toWords(
        totalAmountDueUSD
      )} USD Only`,
      totalAmountDueINRWords: `${numberToWords.toWords(
        totalAmountDueINR
      )} INR Only`,
      signatureAndSeal: "<signature & seal here>",
    };

    // mail logic
    const templatePath = path.resolve("utils", "mailTemplate.html");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(templateSource);
    const filledTemplate = template(invoiceData);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 60000,
    });
    const page = await browser.newPage();
    await page.setContent(filledTemplate);
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    const transporter = nodemailer.createTransport({
      service: "Outlook",
      auth: {
        user: "parakh@inzint.com",
        pass: "K@nu@9358",
      },
    });

    const mailOptions = {
      from: "parakh@inzint.com",
      to: userEmail,
      subject: `Invoice ${invoice.serialNumber}`,
      text: `Please find attached the invoice ${invoice.serialNumber}.`,
      attachments: [
        {
          filename: `Invoice-${invoice.serialNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      data: invoiceData,
    });
  } catch (error) {
    next(error);
  }
};
