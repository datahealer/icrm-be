import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define Resource sub-schema..]1u2
const resourceSchema = new Schema({
  personId: {
    type: Schema.Types.ObjectId,
    ref: "People",
    required: true,
  },
  defaultAllocation: {
    type: Number,
    enum: [5, 10, 15, 20, 25, 30, 35, 40],
  },
  startDate: { type: Date, required: true },

  endDate: Date,
  acquisitionPersonId: {
    type: Schema.Types.ObjectId,
    ref: "People",
  },
  billability: {
    type: String,
    enum: ["Billable", "Not Billable", "Shadow"],
    required: true,
  },
  shadowOf: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
  billingRate: {
    type: Number,
    validate: {
      validator: function (value) {
        // Non-zero positive value required if Billability is Billable
        return !(this.billability === "Billable" && (!value || value <= 0));
      },
      message:
        "Billing rate must be a non-zero positive value if Billability is Billable",
    },
  },

  shadowOf: {
    type: Schema.Types.ObjectId,
    ref: "People",
  },

  overtimeAllocations: [
    {
      startDate: Schema.Types.Date,
      endDate: Schema.Types.Date,
      hours: {
        type: Number,
        required: true,
      },
      billingRate: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["INACTIVE", "ACTIVE"],
        default: "INACTIVE",
      },
    },
  ],
});

// Define Project schema
const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    managerId: {
      type: String,
      ref: "People",
      required: true,
    },
    acquisitionPersonId: {
      type: String,
      ref: "People",
      required: true,
    },
    status: {
      type: String,
      enum: ["In Progress", "Cancelled", "Completed", "Yet to Start"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    resources: [resourceSchema],
  },
  { timestamps: true }
);

const Project = model("Project", projectSchema);

export default Project;
