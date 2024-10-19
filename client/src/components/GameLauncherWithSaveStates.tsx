import React, { useState, useEffect } from 'react';
import { Nostalgist } from 'nostalgist';
import '../App.css';

const GameLauncher: React.FC = () => {
    const [emulatorInstance, setEmulatorInstance] = useState<any>(null);
    const [saveStates, setSaveStates] = useState<{ state: Blob, thumbnail?: Blob }[]>([]);
    const [error, setError] = useState<string>('');

    // Load save states from localStorage when component mounts
    useEffect(() => {
        try {
            const savedStates = localStorage.getItem('nesGameSaveStates');
            if (savedStates) {
                const parsedStates = JSON.parse(savedStates);
                // Convert base64 strings back to Blobs
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

    // Helper function to convert Blob to base64
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

    // Helper function to convert base64 to Blob
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
            
            setEmulatorInstance(nostalgist);
        } catch (error) {
            console.error("Error launching game:", error);
            setError(`Failed to launch game: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleSaveState = async () => {
        if (!emulatorInstance) {
            setError('Game must be running to save state');
            return;
        }

        try {
            const saveData = await emulatorInstance.saveState();
            
            // Convert Blobs to base64 before saving to localStorage
            const base64State = await blobToBase64(saveData.state);
            const base64Thumbnail = saveData.thumbnail ? await blobToBase64(saveData.thumbnail) : undefined;
            
            const newStates = [...saveStates, saveData];
            setSaveStates(newStates);

            // Save to localStorage
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

    return (
        <div className="game-launcher-container">
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
    
            <div 
                id="emulator-container"
                className="emulator-container"
            />
        </div>
    );
};

export default GameLauncher;