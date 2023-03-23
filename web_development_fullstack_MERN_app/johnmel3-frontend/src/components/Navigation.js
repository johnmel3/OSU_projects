import React from 'react';
import { Link } from 'react-router-dom';


function navigationLinks() {
  return (
    <nav>
        <Link className="App-nav" to="/">Home</Link>
        <Link className="App-nav" to="../add-exercise">Add Exercise</Link>
    </nav>
  );
}

export default navigationLinks;
