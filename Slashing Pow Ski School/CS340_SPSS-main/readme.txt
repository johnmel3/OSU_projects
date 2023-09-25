CODE CITATION:
Date: 03/02/2023
This code was developed from the NodeJS Starter App Walkthrough. 
All functions throughout the app are adapted from:
Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

Add_student.js, update_student.js, delete_student.js, students.hbs, and app.js routes for student were built based on the above starter app and modified. Subsequent 
functions were created with a similar structure following the same template created in the student and so are also based on the starter app walkthrough. Add proficiency post route was created using the above starter app.
In general, the NodeJS Walkthrough was used to put together these apps with heavy modifications to functions to fit the needs of
the app.

App.js routes are generally from the walkthrough. db.pool.query functions are relatively unmodified. Setting up the queries and any
preprocessing of data (null checks etc.) are mostly original.

HTML/hbs files are adapted from NodeJS walkthrough, especially for Students as this was the first page built and 
followed the walkthrough closely. Setting up the table headers/body is from the NodeJS walkthrough.
Forms are modified from the walkthrough.

CSS is original.

Javascript functions in the js folder are all modified from the NodeJS Starter app walkthrough. They are updated to
use the right aliases, variable names, along with removing unused portions. In general the AJAX request portion is
unchanged from the NodeJS walkthrough apart from adding manual refreshes.