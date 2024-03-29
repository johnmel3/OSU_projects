// App.js
/*  CODE CITATION:
    Date: 03/02/2023
    This code was developed from the NodeJS Starter App Walkthrough. 
    Several functions throughout the app are adapted from:
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*
    SETUP -- Code is copied from the NodeJS Starter App Walkthrough
*/
// Express

var express = require("express"); // We are using the express library for the web server
var app = express(); // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
PORT = 22998;
// Database
var db = require("./database/db-connector");
// Handlebars
const { engine } = require("express-handlebars");
var exphbs = require("express-handlebars"); // Import express-handlebars
app.engine(".hbs", engine({ extname: ".hbs" })); // Create an instance of the handlebars engine to process templates
app.set("view engine", ".hbs"); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
/*
    The folowing get() routes are for rendering the pages and the data on the pages.
    For each get() route, these are generally based on the NodeJS Starter App Walkthrough but are heavily
    modified to fit the needs of the project.
*/

// Basic route that renders the homepage
app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/instructors", function (req, res) {
  let query1 =
    "SELECT id_instructor as 'Instructor ID', instructor_fname as 'First Name', instructor_lname as 'Last Name', instructor_phone_number as 'Phone Number', years_of_experience as 'Years of Experience', CASE first_aid_certified WHEN 1 then 'Yes' WHEN 0 then 'No' END as 'First Aid Certified' FROM Instructors;";

  db.pool.query(query1, function (error, rows, fields) {
    let instructors = rows;
    return res.render("instructors", { data: instructors });
  });
});

app.get("/student-registrations", (req, res) => {
  let query1 =
    "SELECT SL.id_student AS 'Student ID', CONCAT(S.student_fname, ' ', S.student_lname) as 'Student', SL.id_lesson AS 'Lesson ID', L.lesson_name as 'Lesson' FROM Students_has_Lessons SL JOIN Lessons AS L ON SL.id_lesson = L.id_lesson JOIN Students AS S ON SL.id_student = S.id_student;";
  let query2 = "SELECT * FROM Students;";
  let query3 = "SELECT * FROM Lessons;";
  db.pool.query(query1, function (error, rows, fields) {
    let studentRegistrations = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let students = rows;

      db.pool.query(query3, (error, rows, fields) => {
        let lessons = rows;
        return res.render("studentregistrations", {
          data: studentRegistrations,
          students: students,
          lessons: lessons,
        });
      });
    });
  });
});

app.get("/lessons", (req, res) => {
  let query1 =
    "SELECT id_lesson AS 'Lesson ID', lesson_name AS 'Lesson Name', id_proficiency AS 'Proficiency Level', CONCAT(instructor_fname, ' ', instructor_lname) AS 'Instructor' FROM `Lessons` join Instructors on Instructors.id_instructor = Lessons.id_instructor;";
  let query2 = "SELECT * FROM Proficiencies;";
  let query3 = "SELECT * FROM Instructors;";
  db.pool.query(query1, function (error, rows, fields) {
    let lessons = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let proficiencies = rows;

      db.pool.query(query3, (error, rows, fields) => {
        let instructors = rows;
        return res.render("lessons", {
          data: lessons,
          proficiencies: proficiencies,
          instructors: instructors,
        });
      });
    });
  });
});

app.get("/proficiencies", (req, res) => {
  let query1 =
    "SELECT id_proficiency AS 'Proficiency ID', proficiency_name AS 'Proficiency Name' FROM Proficiencies ORDER BY id_proficiency ASC;";
  db.pool.query(query1, function (error, rows, fields) {
    let proficiencies = rows;
    return res.render("proficiencies", { proficiencies: proficiencies });
  });
});

app.get("/students", function (req, res) {
  let query1 =
    "SELECT id_student as 'Student ID', id_proficiency as 'Proficiency ID', student_fname as 'First Name', student_lname as 'Last Name', student_phone_number as 'Phone Number', emergency_fname as 'Emergency Contact First Name', emergency_lname as 'Emergency Contact Last Name', emergency_phone as 'Emergency Contact Number',  CASE waiver_signed WHEN 1 THEN 'Yes' WHEN 0 THEN 'No' END as 'Waiver Signed' FROM Students;";
  let query2 = "SELECT * FROM Proficiencies;";
  db.pool.query(query1, function (error, rows, fields) {
    let students = rows;

    // Run the second query
    db.pool.query(query2, (error, rows, fields) => {
      let proficiencies = rows;
      return res.render("students", {
        data: students,
        proficiencies: proficiencies,
      });
    });
  });
});

/* Add a new student -- Built from the NodeJS Starter App Walkthrough with some original
  modifications for handling null values and setting up the query.*/
app.post("/add-student-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  let waiver_signed = data["Waiver Signed"];

  // converting to nulls where needed to prevent sending an empty string
  const values = [
    data["Proficiency ID"] || null,
    data["First Name"] || null,
    data["Last Name"] || null,
    data["Phone Number"] || null,
    data["Emergency Contact First Name"] || null,
    data["Emergency Contact Last Name"] || null,
    data["Emergency Contact Number"] || null,
  ];
  // waiver signed is sent as yes/no so conver that to the appropriate format of 1/0.
  if (waiver_signed === "Yes") {
    waiver_signed = 1;
  } else {
    waiver_signed = 0;
  }
  const query1 = `INSERT INTO Students (id_proficiency, student_fname, student_lname, student_phone_number, emergency_fname, emergency_lname, emergency_phone, waiver_signed) VALUES (?, ?, ?, ?, ?, ?, ?, ${waiver_signed})`;

  // Create the query and run it on the database

  db.pool.query(query1, values, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // If there was no error, perform a SELECT * on Students
      query2 = `SELECT * FROM Students;`;
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows);
        }
      });
    }
  });
});

/* Add instructor -- Built from the NodeJS Starter App Walkthrough with some original
  modifications for handling null values and setting up the query.*/
app.post("/add-instructor-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  let first_aid_certified = data["First Aid Certified"];
  // Converting to nulls where needed to prevent the empty string bug and use this for the query
  const values = [
    data["First Name"] || null,
    data["Last Name"] || null,
    data["Phone Number"] || null,
    data["Years of Experience"] || null,
  ];
  //conver the yes/no to 1 or 0
  if (first_aid_certified === "Yes") {
    first_aid_certified = 1;
  } else {
    first_aid_certified = 0;
  }

  const query1 = `INSERT INTO Instructors (instructor_fname, instructor_lname, instructor_phone_number, years_of_experience, first_aid_certified) VALUES (?, ?, ?, ?, ${first_aid_certified})`;

  // Create the query and run it on the database
  db.pool.query(query1, values, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // If there was no error, perform a SELECT * on Instructors
      query2 = `SELECT * FROM Instructors;`;
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows);
        }
      });
    }
  });
});

/* Adds a proficiency using the non-AJAX method in the NodeJS walkthrough*/
app.post("/add-proficiency-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  let id = data["input-id"];
  let name = data["input-name"];
  // If either is null its a bad request, so just null both and send that so the error occurs.
  if (id === "" || name === "") {
    id = null;
    name = null;
    query1 = `INSERT INTO Proficiencies (id_proficiency, proficiency_name) VALUES (${id}, ${name})`;
  } else {
    query1 = `INSERT INTO Proficiencies (id_proficiency, proficiency_name) VALUES ('${data["input-id"]}', '${data["input-name"]}')`;
  }
  // Create the query and run it on the database

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      //res.status(400).send('An error has occurred. You may have entered duplicate or null data. Please refresh and try again.');
      res.status(400).redirect("/proficiencies");
    } else {
      res.redirect("/proficiencies");
    }
  });
});

/* Adds a lesson -- modified from NodeJS walkthrough.*/
app.post("/add-lesson-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // converting to nulls where needed to prevent the empty string bug
  const values = [
    data["Lesson Name"] || null,
    data["Proficiency Level"] || null,
    data["Instructor"] || null,
  ];
  // Create the query and run it on the database
  const query1 = `INSERT INTO Lessons (lesson_name, id_proficiency, id_instructor) VALUES (?, ?, ?)`;

  db.pool.query(query1, values, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // This query is used to get the instructor data in the right format to display it on the table.
      query2 = `SELECT l.id_lesson, l.lesson_name, p.id_proficiency, CONCAT(i.instructor_fname, ' ', i.instructor_lname) AS instructor_name
            FROM Lessons l JOIN Proficiencies p ON l.id_proficiency = p.id_proficiency JOIN Instructors i ON l.id_instructor = i.id_instructor ORDER BY l.id_lesson;`;
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows);
        }
      });
    }
  });
});

/* Adds a student lesson registration*/
app.post("/add-registration-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  let studentID = parseInt(data["Student ID"]);
  let lessonID = parseInt(data["Lesson ID"]);
  const query1 = `INSERT INTO Students_has_Lessons (id_student, id_lesson) VALUES (${studentID}, ${lessonID});`;

  // Create the query and run it on the database

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      // second query to get data for the table in the right format
      query2 = `SELECT S.id_student, CONCAT(S.student_fname, ' ', student_lname) AS student_name, L.id_lesson, L.lesson_name FROM Students_has_Lessons SL JOIN Students S ON SL.id_student = S.id_student JOIN Lessons L ON SL.id_lesson = L.id_lesson;`;
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows);
        }
      });
    }
  });
});

/* Deletes the student -- deletes are built on NodeJS code, due to their simple nature are all similar to each other
and the walkthrough*/
app.delete("/delete-student-ajax/", function (req, res, next) {
  let data = req.body;
  let studentID = parseInt(data.Student_ID); // Get the student ID from the data
  let deleteStudents = `DELETE FROM Students WHERE id_student = ?`;

  // Delete of student will cascade
  db.pool.query(deleteStudents, [studentID], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

/* Deletes the registration ie intersection table*/
app.delete("/delete-registration-ajax/", function (req, res, next) {
  let data = req.body;
  let studentID = parseInt(data.Student_ID); // Get the student ID from the data
  let lessonID = parseInt(data.Lesson_ID); // Get the lesson ID from the data
  let deleteRegistrations = `DELETE FROM Students_has_Lessons WHERE id_student = ? AND id_lesson = ?`;

  // Delete the registration using the student and lesson IDs
  db.pool.query(
    deleteRegistrations,
    [studentID, lessonID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

/* Deletes the instructor */
app.delete("/delete-instructor-ajax/", function (req, res, next) {
  let data = req.body;
  let instructorID = parseInt(data.Instructor_ID);
  let deleteInstructors = `DELETE FROM Instructors WHERE id_instructor = ?`;

  // Delete of instructor will cascade
  db.pool.query(
    deleteInstructors,
    [instructorID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

/* Deletes the lesson */
app.delete("/delete-lesson-ajax/", function (req, res, next) {
  let data = req.body;
  let lessonID = parseInt(data.Lesson_ID);
  let deleteLesson = `DELETE FROM Lessons WHERE id_lesson = ?`;

  // Delete the lesson
  db.pool.query(deleteLesson, [lessonID], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

/* UPDATES the Student -- adapted from NodeJS walkthrough*/
app.put("/put-student-ajax", function (req, res, next) {
  let data = req.body;

  let proficiency = data.proficiency;
  let student = parseInt(data.fullname);

  if (proficiency === "null") {
    proficiency = null;
  }
  let queryUpdateProficiency = `UPDATE Students SET id_proficiency = ? WHERE Students.id_student = ?`;
  let selectProficiency = `SELECT * FROM Proficiencies WHERE id_proficiency = ?`;

  // Run the 1st query
  db.pool.query(
    queryUpdateProficiency,
    [proficiency, student],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        // Run the second query
        db.pool.query(
          selectProficiency,
          [proficiency],
          function (error, rows, fields) {
            if (error) {
              console.log(error);
              res.sendStatus(400);
            } else {
              res.send(rows);
            }
          }
        );
      }
    }
  );
});
/* Update registration, modified from student UPDATE which is based on the NodeJS walkthrough */
app.put("/put-registration-ajax", function (req, res, next) {
  let data = req.body;
  // get all the data to pass to the query as INTs
  let studentToUpdate = parseInt(data.iStudent);
  let lessonToUpdate = parseInt(data.iLesson);
  let newStudent = parseInt(data.oStudent);
  let newLesson = parseInt(data.oLesson);
  let queryUpdateRegistration = `UPDATE Students_has_Lessons SET id_student = ?, id_lesson = ? WHERE id_student = ? and id_lesson = ?`;

  // Run the query
  db.pool.query(
    queryUpdateRegistration,
    [newStudent, newLesson, studentToUpdate, lessonToUpdate],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.send(rows);
      }
    }
  );
});

/*
    LISTENER
*/
app.listen(PORT, function () {
  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});
