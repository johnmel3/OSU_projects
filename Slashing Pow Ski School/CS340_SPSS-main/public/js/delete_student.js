/* Adapted directly from starter app code */
/* Deletes a student from the database */

function deleteStudent(Student_ID) {
    // Get the student ID
    let data = {
        Student_ID: Student_ID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // remove student and refresh
            deleteRow(Student_ID);
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
}

// Removes the row from the table, because of location.reload() not really necessary.
// We ran out of time trying to correct the CSS issue with the table which is only fixed
// on refresh.
// Mostly unchanged from starter app code.
function deleteRow(Student_ID){
    let table = document.getElementById("students-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == Student_ID) {
            table.deleteRow(i);
            deleteDropDownMenu(Student_ID);
            break;
       }
    }
}
// Updates the drown down menu.
// Mostly unchanged from starter app code.
function deleteDropDownMenu(Student_ID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(Student_ID)){
        selectMenu[i].remove();
        break;
    } 

    }
}