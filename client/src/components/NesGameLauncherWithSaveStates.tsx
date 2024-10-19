import React, { useState, useEffect } from 'react';
import { Nostalgist } from 'nostalgist';
import '../App.css';

const NesGameLauncherWithSaveStates: React.FC = () => {
    const [emulatorInstance, setEmulatorInstance] = useState<any>(null);
    const [saveStates, setSaveStates] = useState<{ state: Blob, thumbnail?: Blob }[]>([]);
    const [error, setError] = useState<string>('');
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        try {
            const savedStates = localStorage.getItem('nesGameSaveStates');
            if (savedStates) {
                const parsedStates = JSON.parse(savedStates);
                const reconstructedStates = parsedStates.map((state: { state: string, thumbnail?: string }) => ({
                    state: base64ToBlob(state.state),
                    thumbnail: state.thumbnail ? base64ToBlob(state.thumbnail) : undefined
                }));
                setSaveStates(reconstructedStates);
            }
        } catch (error) {
            console.error("Error loading states from localStorage:", error);
            setError("Failed to load saved states from storage");
        }
    }, []);

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result.split(',')[1]);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const base64ToBlob = (base64: string): Blob => {
        const byteString = atob(base64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([arrayBuffer]);
    };

    const launchGame = async () => {
        try {
            const response = await fetch('/roms/FF1.nes');
            const romData = await response.blob();
            
            const nostalgist = await Nostalgist.nes({
                fileContent: romData,
                fileName: 'FF1.nes'
            });
    
            nostalgist.resize({ width: 512, height: 480 });
    
            const canvas = nostalgist.getCanvas();
            const emulatorContainer = document.getElementById('emulator-container');
            if (emulatorContainer) {
                emulatorContainer.innerHTML = ''; 
                emulatorContainer.appendChild(canvas);
    
                canvas.style.position = 'relative'; 
                canvas.style.left = '0';            
                canvas.style.top = '0';             
                canvas.style.zIndex = 'auto';       
                canvas.style.margin = '0 auto';     
            }
    
            setEmulatorInstance(nostalgist);
            setupControllerSupport(nostalgist); // Set up controller support after launching the game
        } catch (error) {
            console.error("Error launching game:", error);
            setError(`Failed to launch game: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const setupControllerSupport = (nostalgist: any) => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    nostalgist.pressDown('up');
                    break;
                case 'ArrowDown':
                    nostalgist.pressDown('down');
                    break;
                case 'ArrowLeft':
                    nostalgist.pressDown('left');
                    break;
                case 'ArrowRight':
                    nostalgist.pressDown('right');
                    break;
                case 'x': // Map 'X' key to the NES 'A' button
                    nostalgist.pressDown('a');
                    break;
                case 'z': // Map 'Z' key to the NES 'B' button
                    nostalgist.pressDown('b');
                    break;
                case 's': // Map 'S' key to the NES 'Start' button
                    nostalgist.pressDown('start');
                    break;
                case 'a': // Map 'A' key to the NES 'Select' button
                    nostalgist.pressDown('select');
                    break;
                default:
                    break;
            }
        };
    
        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    nostalgist.pressUp('up');
                    break;
                case 'ArrowDown':
                    nostalgist.pressUp('down');
                    break;
                case 'ArrowLeft':
                    nostalgist.pressUp('left');
                    break;
                case 'ArrowRight':
                    nostalgist.pressUp('right');
                    break;
                case 'x': // Release the NES 'A' button
                    nostalgist.pressUp('a');
                    break;
                case 'z': // Release the NES 'B' button
                    nostalgist.pressUp('b');
                    break;
                case 's': // Release the NES 'Start' button
                    nostalgist.pressUp('start');
                    break;
                case 'a': // Release the NES 'Select' button
                    nostalgist.pressUp('select');
                    break;
                default:
                    break;
            }
        };
    
        // Add event listeners for keydown and keyup events
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    
        // Clean up event listeners when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    };

    const handleSaveState = async () => {
        if (!emulatorInstance) {
            setError('Game must be running to save state');
            return;
        }

        try {
            const saveData = await emulatorInstance.saveState();
            
            const base64State = await blobToBase64(saveData.state);
            const base64Thumbnail = saveData.thumbnail ? await blobToBase64(saveData.thumbnail) : undefined;
            
            const newStates = [...saveStates, saveData];
            setSaveStates(newStates);

            const statesForStorage = await Promise.all(
                newStates.map(async (state) => ({
                    state: await blobToBase64(state.state),
                    thumbnail: state.thumbnail ? await blobToBase64(state.thumbnail) : undefined
                }))
            );
            
            localStorage.setItem('nesGameSaveStates', JSON.stringify(statesForStorage));
            console.log('State saved successfully!');
        } catch (error) {
            console.error("Error saving state:", error);
            setError(`Failed to save state: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleLoadState = async (index: number) => {
        if (!emulatorInstance) {
            setError('Game must be running to load state');
            return;
        }

        try {
            const stateToLoad = saveStates[index];
            if (stateToLoad) {
                await emulatorInstance.loadState(stateToLoad.state);
                console.log('State loaded successfully!');
            }
        } catch (error) {
            console.error("Error loading state:", error);
            setError(`Failed to load state: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handlePause = () => {
        if (emulatorInstance) {
            emulatorInstance.pause();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if (emulatorInstance) {
            emulatorInstance.resume();
            setIsPaused(false);
        }
    };

    const handleRestart = () => {
        if (emulatorInstance) {
            emulatorInstance.restart();
            setIsPaused(false);
        }
    };

    return (
        <div className="game-launcher-page">
            <div className="controls-container">
                <h2 className="text-xl font-bold mb-4">Launch Final Fantasy</h2>
    
                <div className="flex gap-2 mb-4">
                    <button 
                        onClick={launchGame}
                        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Start Game
                    </button>

                    <button 
                        onClick={handlePause}
                        disabled={!emulatorInstance || isPaused}
                        className={`px-4 py-2 rounded ${
                            !isPaused && emulatorInstance 
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Pause
                    </button>

                    <button 
                        onClick={handleResume}
                        disabled={!emulatorInstance || !isPaused}
                        className={`px-4 py-2 rounded ${
                            isPaused 
                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Resume
                    </button>

                    <button 
                        onClick={handleRestart}
                        disabled={!emulatorInstance}
                        className={`px-4 py-2 rounded ${
                            emulatorInstance 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Reset Game
                    </button>
    
                    <button 
                        onClick={handleSaveState}
                        disabled={!emulatorInstance}
                        className={`px-4 py-2 rounded ${
                            emulatorInstance 
                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Save State
                    </button>
                </div>
    
                {saveStates.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Saved States:</h3>
                        <div className="space-y-2">
                            {saveStates.map((save, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <button 
                                        onClick={() => handleLoadState(index)}
                                        className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                                    >
                                        Load State {index + 1}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
    
                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}
            </div>
    
            <div id="emulator-container" className="emulator-container"></div>

            <div className="key-legend mt-4">
            <h3 className="text-lg font-bold">You can use a controller too!</h3>
                <h3 className="text-lg font-bold">Keyboard Controls:</h3>
                <ul className="list-disc list-inside">
                    <li><strong>Arrow Keys</strong> - Move</li>
                    <li><strong>Z</strong> - B Button</li>
                    <li><strong>X</strong> - A Button</li>
                    <li><strong>A</strong> - Select</li>
                    <li><strong>S</strong> - Start</li>
                </ul>
            </div>
        </div>
    );
};

export default NesGameLauncherWithSaveStates;
