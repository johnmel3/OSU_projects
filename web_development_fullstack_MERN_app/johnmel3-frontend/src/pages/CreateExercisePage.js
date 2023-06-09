import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export const CreateExercisePage = () => {
    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('');
    const [date, setDate] = useState('');
    
    const history = useHistory();

    const addExercise= async () => {
        // Creates exercise with user's parameters
        const newExercise = { name, reps, weight, unit, date };
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.status === 201) {
            alert("Successfully added exercise!");
        } else {
            alert(`Failed to add exercise. Please ensure all fields are filled out. Status code = ${response.status}`);
        }
        history.push("/");
    };

    return (
        <div>
            <h1>Add Exercise</h1>
            <form>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)} />
                <input
                    type="number"
                    placeholder="Completed Reps"
                    min="1"
                    value={reps}
                    onChange={e => setReps(e.target.value)} />
                <input
                    type="number"
                    placeholder="Weight Used"
                    min="1"
                    value={weight}
                    onChange={e => setWeight(e.target.value)} />
                <select 
                    name="unit"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}>
                    <option value=""></option>
                    <option value="lbs">lbs</option>
                    <option value="kgs">kgs</option>
                </select>
                <input
                    type="text"
                    placeholder="MM-DD-YY"
                    value={date}
                    onChange={e => setDate(e.target.value)} />
            </form>
                <button onClick={addExercise}>Add</button>
        </div>
    );
}

export default CreateExercisePage;