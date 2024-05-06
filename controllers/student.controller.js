const Student = require("../models/student.model");

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("courses");
    res.status(200).json({
      success: true,
      students,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const saveStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(200).json({
      success: true,
      student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    res.status(200).json({
      success: true,
      student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updatedStudent = await Student.findById(id);
    res.status(200).json({
      success: true,
      updatedStudent,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getStudents,
  saveStudent,
  getStudent,
  updateStudent,
  deleteStudent,
};
