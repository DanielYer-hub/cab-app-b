const mongoose = require("mongoose");
const Record = require("../models/Record");
const Section = require("../models/Section");
const FieldTemplate = require("../models/FieldTemplate");

const buildSearchText = (values) => {
  return Object.values(values || {})
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value).toLowerCase())
    .join(" ");
};

const getRecordsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const section = await Section.findOne({
      _id: sectionId,
      userId: req.user._id,
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const records = await Record.find({
      sectionId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createRecord = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { values } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const section = await Section.findOne({
      _id: sectionId,
      userId: req.user._id,
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const fields = await FieldTemplate.find({
      sectionId,
      userId: req.user._id,
    });

    if (!values || typeof values !== "object") {
      return res.status(400).json({ message: "Values are required" });
    }

    for (const field of fields) {
      if (field.required) {
        const fieldValue = values[field.key];
        if (
          fieldValue === undefined ||
          fieldValue === null ||
          String(fieldValue).trim() === ""
        ) {
          return res.status(400).json({
            message: `Field "${field.label}" is required`,
          });
        }
      }
    }

    const record = await Record.create({
      userId: req.user._id,
      sectionId,
      values,
      searchText: buildSearchText(values),
    });

    return res.status(201).json(record);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid record id" });
    }

    const record = await Record.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { values } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid record id" });
    }

    const record = await Record.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (!values || typeof values !== "object") {
      return res.status(400).json({ message: "Values are required" });
    }

    const fields = await FieldTemplate.find({
      sectionId: record.sectionId,
      userId: req.user._id,
    });

    for (const field of fields) {
      if (field.required) {
        const fieldValue = values[field.key];
        if (
          fieldValue === undefined ||
          fieldValue === null ||
          String(fieldValue).trim() === ""
        ) {
          return res.status(400).json({
            message: `Field "${field.label}" is required`,
          });
        }
      }
    }

    record.values = values;
    record.searchText = buildSearchText(values);

    await record.save();

    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid record id" });
    }

    const record = await Record.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecordsBySection,
  createRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
};