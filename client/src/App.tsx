import './App.css'
import React from 'react';
import GameLauncher from './components/GameLauncher';
import SnesGameLauncher from './components/SnesGameLauncher';
import GameLauncherWithSaveState from './components/GameLauncherWithSaveStates';
import SnesGameLauncherWithSaveStates from './components/SnesGameLauncherWithSaveStates';
import GbcGameLauncherWithSaveStates from './components/GbcGameLauncherWithSaveStates';
import GbGameLauncherWithSaveStates from './components/GbGameLauncherWithSaveStates';

const App: React.FC = () => {
    return (
        <div>
            <h1>Nostalgist.js Retro Game Launcher</h1>
            {/* <GameLauncher /> */}
            {/* <SnesGameLauncher/> */}
            {/* <GameLauncherWithSaveState/> */}
            {/* <SnesGameLauncherWithSaveStates/> */}
            {/* <GbcGameLauncherWithSaveStates/> */}
                <GbGameLauncherWithSaveStates/>
        </div>
    );
};

export default App;
