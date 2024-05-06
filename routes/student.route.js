const express = require("express");
const router = express.Router();
const auth = require("../auth");

const {
  getStudents,
  saveStudent,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

// Get all student
router.get("/get/students", auth, getStudents);

// Create a student
router.post("/save/student", auth, saveStudent);

// Get student by id
router.get("/get/student/:id", auth, getStudent);

// Update student by id
router.put("/update/student/:id", auth, updateStudent);

// Delete student by id
router.delete("/delete/student/:id", auth, deleteStudent);

module.exports = router;
