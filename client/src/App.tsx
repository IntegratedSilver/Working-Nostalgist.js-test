import './App.css'
import React from 'react';
import GameLauncher from './components/GameLauncher';

const App: React.FC = () => {
    return (
        <div>
            <h1>Nostalgist.js Retro Game Launcher</h1>
            <GameLauncher />
        </div>
    );
};

export default App;
