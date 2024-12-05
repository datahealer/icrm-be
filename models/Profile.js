import mongoose from "mongoose";
const { Schema, model } = mongoose;
// Define the Profile schema
const profileSchema = new Schema(
  {
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    about: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: Number,
      trim: true,
    },
  },
  { timestamps: true }
);

// Export the Profile model
const Profile = model("Profile", profileSchema);

export default Profile;
