const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewere/authMiddleware");
const {
  getRecordsBySection,
  createRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

router.use(authMiddleware);

router.get("/sections/:sectionId/records", getRecordsBySection);
router.post("/sections/:sectionId/records", createRecord);
router.get("/records/:id", getRecordById);
router.put("/records/:id", updateRecord);
router.delete("/records/:id", deleteRecord);

module.exports = router;