const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
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
    values: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    searchText: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;