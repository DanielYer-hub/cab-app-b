const mongoose = require("mongoose");
const Section = require("../models/Section");

const getSections = async (req, res) => {
  try {
    const sections = await Section.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(sections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const section = await Section.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    return res.status(200).json(section);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createSection = async (req, res) => {
  try {
    const { title, description } = req.body || {};

    if (!title || title.trim().length < 2) {
      return res.status(400).json({ message: "Title is required" });
    }

    const section = await Section.create({
      userId: req.user._id,
      title: title.trim(),
      description: description?.trim() || "",
    });

    return res.status(201).json(section);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const section = await Section.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    if (title !== undefined) {
      if (!title.trim() || title.trim().length < 2) {
        return res.status(400).json({ message: "Title is required" });
      }
      section.title = title.trim();
    }

    if (description !== undefined) {
      section.description = description.trim();
    }

    await section.save();

    return res.status(200).json(section);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const section = await Section.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    return res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
};