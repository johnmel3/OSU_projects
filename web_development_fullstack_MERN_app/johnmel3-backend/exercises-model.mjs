// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if(err){
        res.status(500).json({ error: '500:Connection to the server failed.' });
    } else  {
        console.log('Successfully connected to MongoDB Exercises collection using Mongoose.');
    }
});

// SCHEMA: Define the collection's schema.
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: String, required: true },
});

// Compile the model from the schema.
const Exercise = mongoose.model("Exercise", exerciseSchema);

/**
* Create a Exercise
* @param {String} name
* @param {Number} reps
* @param {Number} weight
* @param {String} unit
* @param {String} date
* @returns A promise. Resolves to the JSON object for the document created by calling save
*/


// CREATE model *****************************************
const createExercise = async (name, reps, weight, unit, date) => {
    // Create an instance of the Exercise model class
    const exercise = new Exercise({ 
        name: name,
        reps: reps, 
        weight: weight,
        unit: unit,
        date: date
    });

    return exercise.save();
}

/* 
    if (!name) {
        throw "Invalid Request. Please enter at least one character to name an exercise."
    }

    if (reps <= 0 || (weight <= 0)) {
        throw "Invalid Request. Reps and weight must be greater than 0."
    }

    if (isNaN(reps || weight)) {
        throw "Invalid Request"
    } */



// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const findExercises = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
}

// Retrieve based on the ID and return a promise.
const findExerciseById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}


// DELETE model based on ID  *****************************************
const deleteById = async (_id) => {
    const result = await Exercise.deleteOne({_id: _id});
    return result.deletedCount;
};


// REPLACE model *****************************************************
const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({_id: _id }, {
        name: name,
        reps: reps,
        weight: weight,
        unit: unit,
        date: date
    });
    return result.modifiedCount;
}

// Export our variables for use in the controller file.
export { createExercise, findExercises, findExerciseById, replaceExercise, deleteById };