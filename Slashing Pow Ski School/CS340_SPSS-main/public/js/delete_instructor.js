// Based on delete_student.js and NodeJS walkthrough.
//Deletes an instructor.

function deleteInstructor(Instructor_ID) {
    // sending instructor id
    let data = {
        Instructor_ID: Instructor_ID
    };

    // Setup our AJAX request - this part will be basically the same everywhere
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-instructor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(Instructor_ID);
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Deletes the row from the table. Works, but not entirely necessary. The page reloads anyway.
// Mostly unchanged from starter app code.
function deleteRow(Instructor_ID){

    let table = document.getElementById("instructors-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == Instructor_ID) {
            table.deleteRow(i);
            deleteDropDownMenu(Instructor_ID);
            break;
       }
    }
}
