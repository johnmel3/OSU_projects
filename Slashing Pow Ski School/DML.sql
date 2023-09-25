-- Project Group: 15
-- James Wollenburg & Melissa Johnson
-- Slashing Pow Ski School

-- DML queries for implementing website/database backend interaction
-- Colon : indicates a variable that will pull data from the backend
-- *****Note: Many of these will not be used, the final file will have the unused queries removed.*****

-- SELECT QUERIES --
-- Select a Lesson and see who the instructor is. For table.
SELECT
    id_lesson AS 'Lesson ID',
    lesson_name AS 'Lesson Name',
    id_proficiency AS 'Proficiency Level',
    CONCAT(
        instructor_fname,
        ' ',
        instructor_lname
    ) AS 'Instructor'
FROM
    `Lessons`
JOIN Instructors ON Instructors.id_instructor = Lessons.id_instructor;

-- select avaiable proficiencies. Used on Proficiencies Page
SELECT
    id_proficiency as 'Proficiency ID',
    proficiency_name as 'Proficiency Name'
FROM
    Proficiencies
ORDER BY 
	id_proficiency ASC;

-- For use in dropdowns
SELECT * FROM Proficiencies

-- Get all instructor data for use in a dropdown
SELECT * FROM Instructors;

-- Get all students for use in a dropdown
SELECT * FROM Students;

-- get all instructors for display in table
SELECT
    id_instructor AS 'Instructor ID',
    instructor_fname AS 'First Name',
    instructor_lname AS 'Last Name',
    instructor_phone_number AS 'Phone Number',
    years_of_experience AS 'Years of Experience',
    CASE first_aid_certified WHEN 1 THEN 'Yes' WHEN 0 THEN 'No'
END AS 'First Aid Certified'
FROM
    Instructors;
-- get all students.
SELECT
    id_student AS 'Student ID',
    id_proficiency AS 'Proficiency ID',
    student_fname AS 'First Name',
    student_lname AS 'Last Name',
    student_phone_number AS 'Phone Number',
    emergency_fname AS 'Emergency Contact First Name',
    emergency_lname AS 'Emergency Contact Last Name',
    emergency_phone AS 'Emergency Contact Number',
    CASE waiver_signed WHEN 1 THEN 'Yes' WHEN 0 THEN 'No'
END AS 'Waiver Signed'
FROM
    Students;

-- Get the data for the intersection table
SELECT
    S.id_student,
    CONCAT(
        S.student_fname,
        ' ',
        student_lname
    ) AS student_name,
    L.id_lesson,
    L.lesson_name
FROM
    Students_has_Lessons SL
JOIN Students S ON
    SL.id_student = S.id_student
JOIN Lessons L ON
    SL.id_lesson = L.id_lesson;

-- INSERTS -- 
-- Inputs are from forms or dropdown (dd)
-- Add a student with Form values
INSERT INTO `Students`(
    `id_proficiency`,
    `student_fname`,
    `student_lname`,
    `student_phone_number`,
    `emergency_fname`,
    `emergency_lname`,
    `emergency_phone`,
    `waiver_signed`
)
VALUES(
    :id_proficiency_dd,
    :student_fname_form,
    :student_lname_form,
    :student_phone_number_form,
    :emergency_fname_form,
    :emergency_lname_form,
    :emergency_phone_form,
    :waiver_signed_form
)

-- Add a Lesson via Form
INSERT INTO `Lessons`(
    `lesson_name`,
    `id_proficiency`,
    `id_instructor`
)
VALUES(
    :lesson_name_form,
    :id_proficiency_dd,
    :id_instructor_dd
)
-- Add M:M Student - Lesson via Form
INSERT INTO `Students_has_Lessons`(`id_student`, `id_lesson`)
VALUES(:id_student_dd, :id_lesson_dd)
-- Add a Proficiency via Form, proficiency id is not auto-increment and needs to be designated
INSERT INTO `Proficiencies`(
    `id_proficiency`,
    `proficiency_name`
)
VALUES(
    :id_proficiency,
    :proficiency_name
)
-- Add an Instructor via Form
INSERT INTO `Instructors`(
    `instructor_fname`,
    `instructor_lname`,
    `instructor_phone_number`,
    `years_of_experience`,
    `first_aid_certified`
)
VALUES(
    :instructor_fname_form,
    :instructor_lname_form,
    :instructor_phone_number_form,
    :years_of_experience_form,
    :first_aid_certified_form
)

-- UPDATE QUERIES --

-- Update a Student
UPDATE
    `Students`
SET
    `id_proficiency` = :new_id
WHERE
    `Students`.id_student = :student_id_form
	
-- Part of the student update process
SELECT * FROM Proficiencies WHERE id_proficiency = :proficiency

-- Update M:M Relationship
UPDATE
    `Students_has_Lessons`
SET
    `id_student` = :new_student_dd,
    `id_lesson` = :new_lesson_dd
WHERE
    `id_student` = :orig_student AND id_lesson = :orig_lesson
	
-- DELETE QUERIES --
-- These will delete data rows using the IDs from the table
-- Delete a Student
DELETE
FROM
    `Students`
WHERE
    `id_student` = :id_from_table
-- Delete a Lesson 
DELETE
FROM
    `Lessons`
WHERE
    `id_lesson` = :id_from_table
-- Delete from M:M table
DELETE
FROM
    `Students_has_Lessons`
WHERE
    `id_student` = :student_from_table AND `id_lesson` = :lesson_from_table
-- Delete an Instructor
DELETE
FROM
    `Instructors`
WHERE
    `id_instructor` = :id_from_table