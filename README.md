if you want to test the other emulators, comment out the current one then uncomment out the one you want to use in the app.tsx.

to put in your own rom, you need to put your own rom into the folder, look for the file name in the coresponding component .tsx code (strings that have the file name and either .sfc, .gb, .gbc, or .nes).

save state will not work without changing the savestate string for local storage.

example: const savedStates = localStorage.getItem('gbGameSaveStates');.

change 'gbGameSaveStates' into what you want (so like 'megaManSaveStates').

there are two strings and they need to match up!

i'll mess around with the emulator cores at some point. the GB emulator runs off of an mGBA core and i believe that is the reason the game has a boarder, or at least pokemon red ver does.

if you find how to change cores, cool! let me know.

THERE IS CONTROLLER SUPPORT - it should work for all controllers, i used a ps5 controller through USB connection for testing.

EDIT: i didnt realize keyboard controls got messed up, sorry! i'll try to add a legend  saying what keys are what!

if you find ways to improve this, let me know!

Nostalgist.js is amazing! it's documentation is 10/10
https://nostalgist.js.org/
