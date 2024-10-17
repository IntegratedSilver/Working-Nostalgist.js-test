import React from 'react';
import { Nostalgist } from 'nostalgist';
import '../App.css'

const GameLauncher: React.FC = () => {
    const launchGame = async () => {
        try {
            
            await Nostalgist.nes('owlia.nes');
        } catch (error) {
            console.error("Error launching game:", error);
        }
    };

    return (
        <div>
            <h2>Launch a Retro Game</h2>
            <button id="launch-button" onClick={launchGame}>
                Launch Game
            </button>
            <div>

            </div>
        </div>
    );
};

export default GameLauncher;