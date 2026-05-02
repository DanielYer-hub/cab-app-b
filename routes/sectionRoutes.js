const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewere/authMiddleware");
const {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");

router.use(authMiddleware);

router.get("/", getSections);
router.get("/:id", getSectionById);
router.post("/", createSection);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

module.exports = router;