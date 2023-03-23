import React from 'react';
import ExerciseList from '../components/ExerciseList';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function HomePage({ setExerciseToEdit }) {
    // Use the history for updating
    const history = useHistory();
    const [exercises, setExercises] = useState([]);


    // DELETE an exercise 
    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            const newExerciseSet = exercises.filter(m => m._id !== _id);
            setExercises(newExerciseSet);
        } else {
            console.error(`Failed to delete exercise with _id = ${_id}, status code = ${response.status}`)
        }
    }

    // UPDATE an exercise
    const onEdit = exercise => {
        setExerciseToEdit(exercise);
        history.push("/edit-exercise");
    }


    // RETRIEVE the list of exercises
    const loadExercises = async () => {
        const response = await fetch('/exercises');
        const exercises = await response.json();
        setExercises(exercises);
    }; 
    

    // LOAD the exercises
    useEffect(() => {
        loadExercises();
    }, []);


    // DISPLAY the exercises
    return (
        <>
                <h2>Exercise Log</h2>
                <ExerciseList 
                    exercises = {exercises}
                    onDelete = {onDelete} 
                    onEdit = {onEdit}>
                </ExerciseList>
        </>
    );
}

export default HomePage;