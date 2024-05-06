const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Please enter student name"],
      trim: true,
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },
    studentYear: {
      type: Number,
      required: [true, "Please enter student year"],
      maxlength: [5, "Student year cannot exceed 5 characters"],
      default: 1,
    },
    studentAverage: {
      type: Number,
      required: [true, "Please enter student average"],
      maxlength: [5, "Student average cannot exceed 5 characters"],
      default: 2.5,
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
