const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const bodyParser = require("body-parser");

const Student = require("./models/student.model");
const Course = require("./models/course.model");
const User = require("./models/user.model");

const studentRoute = require("./routes/student.route");

const { faker } = require("@faker-js/faker");

const serv = 9090;
const app = express();

//middleware
app.use(express.json());

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Curb Chrome CORS Error by adding a header here
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

mongoose
  .connect(
    "mongodb+srv://admin:admin@nodebackend.qbovm6i.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NodeBackend"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(serv, () => {
      console.log(`Server is running on port ${serv}`);
    });
  })
  .catch((err) => console.log(err));

// routes
app.use("/", studentRoute);
// app.use("/course", courseRoute)

//default
app.get("/", (req, res) => {
  res.send("Hello from API");
});

// Get all courses
app.get("/courses", auth, async (req, res) => {
  try {
    const courses = await Course.find().populate("student");
    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

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

// AUTHENTICATION
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
