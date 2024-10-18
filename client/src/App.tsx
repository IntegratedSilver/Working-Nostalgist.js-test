import './App.css'
import React from 'react';
import GameLauncher from './components/GameLauncher';
import SnesGameLauncher from './components/SnesGameLauncher';

const App: React.FC = () => {
    return (
        <div>
            <h1>Nostalgist.js Retro Game Launcher</h1>
            <GameLauncher />
            <SnesGameLauncher/>
        </div>
    );
};

export default App;
