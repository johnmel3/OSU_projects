/* Based on update_student.js so indirectly a modification of start app code sourced in readme. */
/* This function updates a Student-Lesson registration. */
// Get the object
let updateRegistrationForm = document.getElementById(
  "update-registration-form-ajax"
);

updateRegistrationForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputStudent = document.getElementById(
    "input-update-registration-student-from"
  );
  let inputLesson = document.getElementById(
    "input-update-registration-lesson-from"
  );
  let outputStudent = document.getElementById(
    "input-update-registration-student-to"
  );
  let outputLesson = document.getElementById(
    "input-update-registration-lesson-to"
  );
  // Get the values from the form fields
  let inputStudentValue = inputStudent.value;
  let inputLessonValue = inputLesson.value;
  let outputStudentValue = outputStudent.value;
  let outputLessonValue = outputLesson.value;

  // Take input student/lesson and output student/lesson data and send to server
  let data = {
    iStudent: inputStudentValue,
    iLesson: inputLessonValue,
    oStudent: outputStudentValue,
    oLesson: outputLessonValue,
  };
  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-registration-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      location.reload();
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  // Send the request
  xhttp.send(JSON.stringify(data));
});
