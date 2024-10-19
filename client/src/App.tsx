import './App.css'
import React from 'react';
import GameLauncher from './components/GameLauncher';
import SnesGameLauncher from './components/SnesGameLauncher';
import GameLauncherWithSaveState from './components/GameLauncherWithSaveStates';

const App: React.FC = () => {
    return (
        <div>
            <h1>Nostalgist.js Retro Game Launcher</h1>
            {/* <GameLauncher /> */}
            {/* <SnesGameLauncher/> */}
            <GameLauncherWithSaveState/>
        </div>
    );
};

export default App;
