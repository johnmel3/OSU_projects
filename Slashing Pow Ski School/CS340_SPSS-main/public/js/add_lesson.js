// Add a lesson -- modified from add_student.js and the Node.js starter app code.
// Follows a similar format, but variables are updated
let addLessonForm = document.getElementById('add-lesson-form-ajax');

// Modify the objects we need
addLessonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLessonName = document.getElementById("input-lesson-name");
    let inputLessonProficiency = document.getElementById("input-lesson-proficiency");
    let inputLessonInstructor = document.getElementById("input-lesson-instructor");
    let instructorName = inputLessonInstructor.options[inputLessonInstructor.selectedIndex].getAttribute("data-name");
    // Get the values from the form fields
    let nameValue = inputLessonName.value;
    let proficiencyValue = inputLessonProficiency.value;
    let instructorValue = inputLessonInstructor.value;
    let instructorNameValue = instructorName
    // We'll send lesson data to the server
    let data = {
        'Lesson Name': nameValue,
        'Proficiency Level': proficiencyValue,
        'Instructor': instructorValue,
        'Inst Name': instructorNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-lesson-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // Add the new data to the table
            addRowToTable(xhttp.response);
            location.reload(); // just having this here as a workaround for the CSS issue
            // Clear the input fields for another transaction
            inputLessonName.value = '';      
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

//Based on NodeJS walkthrough
addRowToTable = (data) => {
    // Gets the table
    let currentTable = document.getElementById("lessons-table");
    let newRowIndex = currentTable.rows.length;
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells for data
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let profCell = document.createElement("TD");
    let instructorCell = document.createElement("TD");
    let deleteCell = document.createElement("TD")
    // Fill the cells with correct data
    idCell.innerText = newRow.id_lesson;
    nameCell.innerText = newRow.lesson_name;
    profCell.innerText = newRow.id_proficiency;
    instructorCell.innerText = newRow.instructor_name;
    deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function(){
        deleteLesson(newRow.id_lesson);
    };
    deleteCell.appendChild(deleteButton);
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(profCell);
    row.appendChild(instructorCell);
    row.appendChild(deleteCell);
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id_lesson);
    // Add the row to the table
    currentTable.appendChild(row);
}