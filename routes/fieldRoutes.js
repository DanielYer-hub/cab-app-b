const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewere/authMiddleware");
const {
  getFieldsBySection,
  createField,
  updateField,
  deleteField,
} = require("../controllers/fieldController");

router.use(authMiddleware);

router.get("/sections/:sectionId/fields", getFieldsBySection);
router.post("/sections/:sectionId/fields", createField);
router.put("/fields/:id", updateField);
router.delete("/fields/:id", deleteField);

module.exports = router;