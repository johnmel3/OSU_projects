-- James Wollenburg and Melissa Johnson
-- Mon Feb 6 2023
-- Slashing Pow Ski School Schema

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
-- -----------------------------------------------------
-- Creates the Proficiences table where id_proficiency is the primary key.
-- All attributes are unique.
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Proficiencies`(
    `id_proficiency` VARCHAR(2) NOT NULL, -- These will follow the format of 1A, 1B, 3A, etc.
    `proficiency_name` VARCHAR(45) NOT NULL, -- Format can be something like 1A - Early Beginner, 1B - Mid Beginner, 1C - Advanced Beginner, 2A - Early Intermediate, 3A - Early Skilled... etc
    PRIMARY KEY(`id_proficiency`),
    UNIQUE KEY `id_proficiency`(`id_proficiency`),
    UNIQUE KEY `proficiency_name`(`proficiency_name`)
);
-- -----------------------------------------------------
-- Creates the Instructors table.
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Instructors`(
    `id_instructor` INT NOT NULL AUTO_INCREMENT,
    `instructor_fname` VARCHAR(45) NOT NULL,
    `instructor_lname` VARCHAR(45) NOT NULL,
    `instructor_phone_number` VARCHAR(15) NOT NULL,
    `years_of_experience` INT NOT NULL,
    `first_aid_certified` BOOLEAN NOT NULL,
    PRIMARY KEY(`id_instructor`),
    UNIQUE KEY `id_instructor`(`id_instructor`),
    UNIQUE KEY `instructor_phone_number`(`instructor_phone_number`)
);

-- -----------------------------------------------------
-- Creates the Students table which holds student registration information.
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Students`(
    `id_student` INT NOT NULL AUTO_INCREMENT,
    `id_proficiency` VARCHAR(2) NULL,
    `student_fname` VARCHAR(45) NOT NULL,
    `student_lname` VARCHAR(45) NOT NULL,
    `student_phone_number` VARCHAR(15) NULL,
    `emergency_fname` VARCHAR(45) NOT NULL,
    `emergency_lname` VARCHAR(45) NOT NULL,
    `emergency_phone` VARCHAR(45) NOT NULL,
    `waiver_signed` BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY(`id_student`),
    UNIQUE KEY `id_student`(`id_student`),
    FOREIGN KEY(`id_proficiency`) REFERENCES `Proficiencies`(`id_proficiency`) ON DELETE SET NULL ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Creates the Lessons table.
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Lessons`(
    `id_lesson` INT NOT NULL AUTO_INCREMENT,
    `lesson_name` VARCHAR(255) NOT NULL, -- Perhaps this needs to be unique to avoid update anomalies? Unsure.
    `id_proficiency` VARCHAR(2) NOT NULL,
    `id_instructor` INT NOT NULL,
    PRIMARY KEY(`id_lesson`),
    UNIQUE KEY `id_lesson`(`id_lesson`),
    FOREIGN KEY(`id_proficiency`) REFERENCES `Proficiencies`(`id_proficiency`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`id_instructor`) REFERENCES `Instructors`(`id_instructor`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `Students_has_Lessons` is the intersection table for Students and Lessons.
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Students_has_Lessons`(
    `id_student` INT NOT NULL,
    `id_lesson` INT NOT NULL,
    PRIMARY KEY(`id_student`, `id_lesson`),
    FOREIGN KEY(`id_student`) REFERENCES `Students`(`id_student`) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY(`id_lesson`) REFERENCES `Lessons`(`id_lesson`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO Proficiencies (id_proficiency, proficiency_name)
VALUES 
    ("1A", "Early Beginner"), 
    ("1B", "Mid Beginner"),
    ("1C", "Advanced Beginner"),
    ("2A", "Early Intermediate"),
    ("2B", "Mid Intermediate"),
    ("2C", "Advanced Intermediate"),
    ("3A", "Early Advanced"),
    ("3B", "Mid Advanced"),
    ("3C", "Advanced");

INSERT INTO Instructors (
    instructor_fname,
    instructor_lname, 
    instructor_phone_number,
    years_of_experience,
    first_aid_certified)
VALUES
    ("Jason", "Wood", "440-652-7456", 5, 1),
    ("Jerold", "Wehmeyer", "207-490-5451", 4, 1),
    ("Adrienne", "Sweitzer", "843-226-9311", 3, 1),
    ("Janita", "Steele", "907-340-8998", 2, 0),
    ("Maxine", "Smalls", "509-528-3827", 1, 0);

INSERT INTO Students (
    id_proficiency,
    student_fname, 
    student_lname, 
    student_phone_number, 
    emergency_fname,
    emergency_lname,
    emergency_phone,
    waiver_signed)

VALUES
    ("1A", "Aaron", "Miller", "646-620-2601", "Araceli", "Barfield", "415-606-0643", 0),
    ("1B", "Anette", "Adams", "361-484-7727", "Sara", "Carrera", "920-702-7461", 0),
    ("1C", "Gary", "Hollingsworth", "573-300-3971", "Lavonne", "Jordan", "916-862-9093", 1),
    ("2B", "Robert", "Thompson", "678-914-6782", "Camelia", "Sullivan", "971-506-9292", 0),
    (Null, "Linda", "Durant", "603-866-4438", "Robert", "Mason", "318-914-1704", 1);

INSERT INTO Lessons (
    lesson_name,
    id_proficiency,
    id_instructor
)
VALUES 
    ("Ski Gear Essentials",
        (SELECT id_proficiency from Proficiencies where proficiency_name = "Early Beginner"),
        (SELECT id_instructor from Instructors where instructor_phone_number = "509-528-3827")),
    ("French fries and pizza and other beginning movements on the slopes",
        (SELECT id_proficiency from Proficiencies where proficiency_name = "Mid Beginner"),
        (SELECT id_instructor from Instructors where instructor_phone_number = "907-340-8998")),
    ("Keeping Skis Parallel and Being Mindful of Arm and Body Position", 
        (SELECT id_proficiency from Proficiencies where proficiency_name = "Early Intermediate"),
        (SELECT id_instructor from Instructors where instructor_phone_number = "843-226-9311")),
    ('Your First Ski Lesson','1A',1),
    ('Your Second Ski Lesson','1B',1);
 
INSERT INTO Students_has_Lessons (id_student, id_lesson)
VALUES
    (
        (SELECT id_student from Students where student_fname = "Aaron" and student_lname = "Miller"),
        (SELECT id_lesson from Lessons where lesson_name = "Ski Gear Essentials"));

INSERT INTO Students_has_Lessons (id_student, id_lesson)
VALUES
    (
        (SELECT id_student from Students where student_fname = "Anette" and student_lname = "Adams"),
        (SELECT id_lesson from Lessons where lesson_name = "Ski Gear Essentials"));
INSERT INTO Students_has_Lessons (id_student, id_lesson)
VALUES
    (
        (SELECT id_student from Students where student_fname = "Anette" and student_lname = "Adams"),
        (SELECT id_lesson from Lessons where lesson_name = "French fries and pizza and other beginning movements on the slopes"));
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

