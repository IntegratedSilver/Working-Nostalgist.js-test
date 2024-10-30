import './App.css'
import React from 'react';
import GameLauncher from './components/GameLauncher';
import SnesGameLauncher from './components/SnesGameLauncher';
import GameLauncherWithSaveState from './components/NesGameLauncherWithSaveStates';
import SnesGameLauncherWithSaveStates from './components/SnesGameLauncherWithSaveStates';
import GbcGameLauncherWithSaveStates from './components/GbcGameLauncherWithSaveStates';
import GbGameLauncherWithSaveStates from './components/GbGameLauncherWithSaveStates';
import NesGameLauncherWithSaveStates from './components/NesGameLauncherWithSaveStates';
import GbaGameLauncherWithSaveStates from './components/GbaGameLauncherWithSaveStates';

const App: React.FC = () => {
    return (
        <div>
            <h1>Nostalgist.js Retro Game Launcher</h1>
            {/* <GameLauncher /> */}
            {/* <SnesGameLauncher/> */}

            {/* the ones above this line were earlier versions, the one below are the decked out built ones */}
            
            {/* <NesGameLauncherWithSaveStates/> */}
            {/* <SnesGameLauncherWithSaveStates/> */}
            {/* <GbcGameLauncherWithSaveStates/> */}
            {/* <GbGameLauncherWithSaveStates/> */}
            <GbaGameLauncherWithSaveStates/>
        </div>
    );
};

export default App;
