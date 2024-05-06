const test = require("node:test");
var assert = require("assert");

const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/student.model");
const studentRoute = require("../routes/student.route");
const Course = require("../models/course.model");

const { faker } = require("@faker-js/faker");

const serv = 9090;
const app = express();

//middleware
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:admin@nodebackend.qbovm6i.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NodeBackend"
  )
  .then(() => {
    // console.log("Connected to database!");
    app.listen(serv, () => {
      //   console.log(`Server is running on port ${serv}`);
    });
  })
  .catch((err) => console.log(err));

// Test creating a student, creating courses then adding them to that student's courses and test the get function that returns the student's courses

test("Number of courses of a student", async () => {
  //   assert.strictEqual(1, 1);
  const student = await Student.create({
    studentName: faker.person.fullName(),
    studentYear: faker.number.int({ min: 1, max: 5 }),
    studentAverage: faker.number.float({
      min: 1,
      max: 10,
      fractionDigits: 2,
    }),
  });
  for (let j = 0; j < 3; j++) {
    const course = await Course.create({
      courseName: faker.word.noun(),
      courseDifficulty: faker.number.int({ min: 1, max: 5 }),
      student: student._id,
    });
    student.courses.push(course._id);
  }
  await student.save();
  assert.strictEqual(student.courses.length, 3);
});
