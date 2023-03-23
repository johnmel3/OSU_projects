import 'dotenv/config';
import express from 'express';
import * as exercises from './exercises-model.mjs';

// const PORT = process.env.PORT;
const PORT = 3000
const app = express();
app.use(express.json());


// CREATE controller ***** Create using POST request.
// Creates a new excercise with name, reps, weight, unit, and date in body.
app.post ('/exercises', (req,res) => { 
    exercises.createExercise(
        req.body.name, 
        req.body.reps, 
        req.body.weight,
        req.body.unit,
        req.body.date,
        )
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: 'Creation of a document failed due to invalid syntax.' });
        });
});

// Route handler for GET requests: Read using GET/exercises 
app.get('/exercises', (req, res) => {
    exercises.findExercises(req.query, '', 0)
        .then(exercises => {
            res.status(200).json(exercises)
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});


// 3. Get using GET/exercises/:_id
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => { 
            if (exercise !== null) {
                res.status(200).json(exercise);
            } else {
                res.status(404).json({ Error: 'Exercise not found' });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: 'Request to retrieve document failed' });
        });

});

// Update using PUT / exercises/:_id
app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(
        req.params._id,
        req.body.name, 
        req.body.reps, 
        req.body.weight, 
        req.body.unit, 
        req.body.date
        )

    .then(numUpdated => {
        if (numUpdated === 1) {
            res.json({
                _id: req.params._id,
                name: req.body.name,
                reps: req.body.reps,
                weight: req.body.weight,
                unit: req.body.unit,
                date: req.body.date
            });
        } else {
            res.status(404).json({ Error: 'Document not found' });
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({ Error: 'Request to update a document failed' });
    });
});


// DELETE Controller ******************************
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request to delete a document failed' });
        });
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});