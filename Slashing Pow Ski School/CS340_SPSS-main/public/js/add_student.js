// Adds a student to the database. This was created by modifying the code from the starter app.
let addStudentForm = document.getElementById('add-student-form-ajax');

// Modify the objects we need
addStudentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields
    let inputProficiency = document.getElementById("input-proficiency");
    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputPhone = document.getElementById("input-phone");
    let inputEmergencyFirst = document.getElementById("input-em_fname");
    let inputEmergencyLast = document.getElementById("input-em_lname");
    let inputEmergencyPhone = document.getElementById("input-em_phone");
    let inputWaiver = document.getElementById("input-waiver");

    // Get values from form
    let proficiencyValue = inputProficiency.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let phoneValue = inputPhone.value;
    let emerFirstValue = inputEmergencyFirst.value;
    let emerLastValue = inputEmergencyLast.value;
    let emerPhoneValue = inputEmergencyPhone.value;
    let waiverValue = inputWaiver.value;

    // send the data, using the alias we set in the model for the names
    let data = {
        'Proficiency ID': proficiencyValue,
        'First Name': firstNameValue,
        'Last Name': lastNameValue,
        'Phone Number': phoneValue,
        'Emergency Contact First Name': emerFirstValue,
        'Emergency Contact Last Name': emerLastValue,
        'Emergency Contact Number': emerPhoneValue,
        'Waiver Signed': waiverValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            location.reload(); // just having this here as a workaround for the CSS issue
            // empty the form fields
            inputProficiency.value = '';
            inputFirstName.value = '';
            inputLastName.value = '';
            inputPhone.value = '';
            inputEmergencyFirst.value = '';
            inputEmergencyLast.value = '';
            inputEmergencyPhone.value = '';
            inputWaiver.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Add a new row to the table. Works but there's an issue with the CSS on the row coloring so we reload the page.
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("students-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells for data
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let profCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emerFirstCell = document.createElement("TD");
    let emerLastCell = document.createElement("TD");
    let emerPhoneCell = document.createElement("TD");
    let waiverCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    // Fill the cells with correct data
    idCell.innerText = newRow.id_student;
    profCell.innerText = newRow.id_proficiency;
    firstNameCell.innerText = newRow.student_fname;
    lastNameCell.innerText = newRow.student_lname;
    phoneCell.innerText = newRow.student_phone_number;
    emerFirstCell.innerText = newRow.emergency_fname;
    emerLastCell.innerText = newRow.emergency_lname;
    emerPhoneCell.innerText = newRow.emergency_phone;
    waiverCell.innerText = newRow.waiver_signed;
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudent(newRow.id_student);
    };
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(profCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(phoneCell);
    row.appendChild(emerFirstCell);
    row.appendChild(emerLastCell);
    row.appendChild(emerPhoneCell);
    row.appendChild(waiverCell);
    row.appendChild(deleteCell);
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id_student);
    // Add the row to the table
    currentTable.appendChild(row);

    // Add the new student to the dropdown menu -- adapted from starter app code
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.student_fname + ' ' +  newRow.student_lname;
    option.value = newRow.id_student;
    selectMenu.add(option);
}