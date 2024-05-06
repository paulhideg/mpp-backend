const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please enter course name"],
      trim: true,
      maxlength: [100, "Course name cannot exceed 100 characters"],
    },
    courseDifficulty: {
      type: Number,
      required: [true, "Please enter course difficulty"],
      maxlength: [3, "Course difficulty cannot exceed 3 characters"],
      default: 1,
    },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
