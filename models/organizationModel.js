import mongoose from "mongoose";

const organizationSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    organization_head: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;