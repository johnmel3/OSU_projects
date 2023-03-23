import React, {useState} from 'react';
import { useHistory } from "react-router-dom";

export const EditPage = ({ exerciseToEdit }) => {
  const [name, setName] = useState(exerciseToEdit.name);
  const [reps, setReps] = useState(exerciseToEdit.reps);
  const [weight, setWeight] = useState(exerciseToEdit.weight);
  const [unit, setUnit] = useState(exerciseToEdit.unit);
  const [date, setDate] = useState(exerciseToEdit.date);

  const history = useHistory();

  const editExercise = async () => {
    const updatedExercise = { name, reps, weight, unit, date };
    const response = await fetch(`/exercises/${exerciseToEdit._id}`, {
      method: 'PUT',
      body: JSON.stringify({updatedExercise}),
      headers: { 'Content-Type': 'application/json', },
    });

    if (response.status === 200) {
      alert("Successfully edited exercise!");
    } else {
      const errMessage = await response.json();
      alert(
        `Failed to edit exercise. Status ${response.status}. ${errMessage.Error}`
      );
    }
    history.push("/");
  };


  return (
    <div>
        <h1>Edit Exercise</h1>
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
                onChange={e => setReps(e.target.value)}/>
            <input
                type="number"
                placeholder="Weight used"
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
            <button
                onClick={editExercise}>Save</button>
        </div>
    );
}

export default EditPage;