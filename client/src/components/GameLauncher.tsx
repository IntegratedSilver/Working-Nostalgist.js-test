import React from 'react';
import { Nostalgist } from 'nostalgist';
import '../App.css';

const GameLauncher: React.FC = () => {
    const launchGame = async () => {
        try {
            const response = await fetch('/roms/FF1.nes');
            const romData = await response.blob();
            
            await Nostalgist.nes({
                fileContent: romData,
                fileName: 'FF1.nes',
               
            });
        } catch (error) {
            console.error("Error launching game:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Launch a Retro Game</h2>
            <button 
                onClick={launchGame}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            >
                Start Game
            </button>

            <div 
                id="emulator-container"
                className="w-full max-w-2xl border border-gray-300 rounded min-h-[480px] mt-4"
            />
        </div>
    );
};

export default GameLauncher;