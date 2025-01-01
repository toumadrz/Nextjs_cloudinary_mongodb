import mongoose from "mongoose";

const FileDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    linkFile: {
      type: String,
      required: true,
    },
    emailUploader: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Filedata = mongoose.models.Filedata || mongoose.model("Filedata", FileDataSchema);
export default Filedata;
