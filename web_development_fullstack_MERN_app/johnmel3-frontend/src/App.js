// Import dependencies
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useState } from 'react';

// Import Pages
import HomePage from './pages/HomePage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditPage from './pages/EditPage';

// Import Components, styles, media
import Navigation from './components/Navigation';
import './App.css';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

// Define the function that renders the content in routes using State.
function App() {

  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <div className="App">
      <Router>
      <AppHeader />
        <div>
          <Navigation />
          <main>
          <Route path="/" exact>
            <HomePage setExerciseToEdit = {setExerciseToEdit}/>
          </Route>
          <Route path="/add-exercise">
            <CreateExercisePage />
          </Route>
          <Route path="/edit-exercise">
            <EditPage exerciseToEdit = {exerciseToEdit} />
          </Route>
          </main>
        </div>
      </Router>
      <AppFooter />
    </div>
  );
}

export default App;
