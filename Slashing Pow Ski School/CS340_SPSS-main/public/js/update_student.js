/* This function was directly adapted from NodeJS starter app code */
/* Updates a student's proficiency level */
// Get the objects we need to modify
let updateStudentForm = document.getElementById("update-student-form-ajax");

// Modify the objects we need
updateStudentForm.addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputFullName = document.getElementById("mySelect");
  let inputProficiency = document.getElementById("input-proficiency-update");

  // Get the values from the form fields
  let fullNameValue = inputFullName.value;
  let proficiencyValue = inputProficiency.value;

  // Nullable relationship allowed so convert empty string to null

  if (proficiencyValue === "") {
    proficiencyValue = null;
  }

  // Send full name and proficiency to the server
  let data = {
    fullname: fullNameValue,
    proficiency: proficiencyValue,
  };
  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-student-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      updateRow(xhttp.response, fullNameValue);
      location.reload(); // Reload the page to update the table
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

// Updates the drop down list of students
function updateRow(data, studentID) {
  let parsedData = JSON.parse(data);

  let table = document.getElementById("students-table");

  for (let i = 0, row; (row = table.rows[i]); i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    if (table.rows[i].getAttribute("data-value") == studentID) {
      // Get the location of the row where we found the matching person ID
      let updateRowIndex = table.getElementsByTagName("tr")[i];

      let td = updateRowIndex.getElementsByTagName("td")[1];

      if (parsedData.length === 0) {
        td.innerHTML = null;
      } else {
        td.innerHTML = parsedData[0].id_proficiency;
      }
    }
  }
}
