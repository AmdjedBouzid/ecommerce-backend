import mongoose from "mongoose";

// Define the Pin schema
const PinSchema = new mongoose.Schema({
  code: { type: String, required: true }, // PIN code
  createdAt: { type: Date, default: Date.now }, // Automatically delete after 60 seconds
});

// Define the model
const Pin = mongoose.models.Pin || mongoose.model("Pin", PinSchema);

export default Pin;
