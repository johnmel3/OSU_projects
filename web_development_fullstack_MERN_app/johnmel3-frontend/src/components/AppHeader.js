import React from 'react';
import { GiStrong } from 'react-icons/gi';
import { IoIosFitness } from 'react-icons/io';

function AppHeader() {
    return (
        <header className="App-header">
            <h1>
                <GiStrong className="App-logo" /> Hustle for that Muscle  <IoIosFitness className="App-logo" />
            </h1>
            <p><em>Get Swole Feed the Soul</em></p>
        </header>
    );
}

export default AppHeader;