const mongoose = require("mongoose");

const fieldTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: ["text", "number", "date", "phone", "textarea", "image"],
      default: "text",
    },
    required: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const FieldTemplate = mongoose.model("FieldTemplate", fieldTemplateSchema);

module.exports = FieldTemplate;