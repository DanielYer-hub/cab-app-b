const mongoose = require("mongoose");
const FieldTemplate = require("../models/FieldTemplate");
const Section = require("../models/Section");

const generateKey = (label) => {
  const cleanedKey = label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "")
    .replace(/^_+|_+$/g, "");

  if (!cleanedKey || cleanedKey.length < 2) {
    return `field_${Date.now()}`;
  }

  return cleanedKey;
};

const getFieldsBySection = async (req, res) => {
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

    const fields = await FieldTemplate.find({
      sectionId,
      userId: req.user._id,
    }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json(fields);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createField = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { label, type, required, order } = req.body || {};

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

    if (!label || label.trim().length < 2) {
      return res.status(400).json({ message: "Label is required" });
    }

    const key = generateKey(label);

    const existingField = await FieldTemplate.findOne({
      sectionId,
      userId: req.user._id,
      key,
    });

    if (existingField) {
      return res.status(400).json({ message: "Field with this label already exists" });
    }

    const field = await FieldTemplate.create({
      userId: req.user._id,
      sectionId,
      label: label.trim(),
      key,
      type: type || "text",
      required: !!required,
      order: order ?? 0,
    });

    return res.status(201).json(field);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, type, required, order } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid field id" });
    }

    const field = await FieldTemplate.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    if (label !== undefined) {
      if (!label.trim() || label.trim().length < 2) {
        return res.status(400).json({ message: "Label is required" });
      }
      field.label = label.trim();
      field.key = generateKey(label);
    }

    if (type !== undefined) {
      field.type = type;
    }

    if (required !== undefined) {
      field.required = !!required;
    }

    if (order !== undefined) {
      field.order = order;
    }

    await field.save();

    return res.status(200).json(field);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid field id" });
    }

    const field = await FieldTemplate.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    return res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFieldsBySection,
  createField,
  updateField,
  deleteField,
};