const express = require("express");
const mongoose = require("mongoose");
const Student = require("./db/studentModel");
const Course = require("./db/courseModel");
const { faker } = require("@faker-js/faker");
const app = express();
const bodyParser = require("body-parser");
// require database connection
const dbConnect = require("./db/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const User = require("./db/userModel");

//middleware
app.use(express.json());

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// execute database connection
dbConnect();

// register endpoint
app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

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

// Get all student
app.get("/get/students", auth, getStudents);

// Create a student
app.post("/save/student", auth, saveStudent);

// Get student by id
app.get("/get/student/:id", auth, getStudent);

// Update student by id
app.put("/update/student/:id", auth, updateStudent);

// Delete student by id
app.delete("/delete/student/:id", auth, deleteStudent);

// COURSES

// Add 5 students with 3 courses each
app.post("/add/sample", auth, async (req, res) => {
  try {
    for (let i = 0; i < 5; i++) {
      const student1 = await Student.create({
        studentName: `Student ${i + 1}`,
        studentYear: i + 1,
        studentAverage: i + 1,
      });
      const course1 = await Course.create({
        courseName: `Course ${i + 1}`,
        courseDifficulty: i,
        student: student1._id,
      });
      const course2 = await Course.create({
        courseName: `Course ${i + 2}`,
        courseDifficulty: i,
        student: student1._id,
      });
      const course3 = await Course.create({
        courseName: `Course ${i + 3}`,
        courseDifficulty: i,
        student: student1._id,
      });
      student1.courses.push(course1._id, course2._id, course3._id);
      await student1.save();
    }
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Add students with courses using faker
app.post("/add/sample/faker", auth, async (req, res) => {
  try {
    for (let i = 0; i < 5; i++) {
      const student1 = await Student.create({
        studentName: faker.person.fullName(),
        studentYear: faker.number.int({ min: 1, max: 5 }),
        studentAverage: faker.number.float({
          min: 1,
          max: 10,
          fractionDigits: 2,
        }),
      });
      for (let j = 0; j < 3; j++) {
        const course1 = await Course.create({
          courseName: faker.word.noun(),
          courseDifficulty: faker.number.int({ min: 1, max: 5 }),
          student: student1._id,
        });
        student1.courses.push(course1._id);
      }
      await student1.save();
    }
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Get number of cpurses of a student
app.get("/get/student/:id/nrcourses", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    res.json(student.courses.length);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = app;
