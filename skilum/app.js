// give each pad a unique keyboard-key and a note
const keyToPad = Object.freeze({
    q: "pad-red",
    w: "pad-yellow",
    a: "pad-green",
    s: "pad-blue",
});
const noteForPads = Object.freeze({
    "pad-red": "C4",
    "pad-yellow": "D4",
    "pad-green": "E4",
    "pad-blue": "F4",
});

// game state variables
let sequence;
let userSequence = [];
let level;
let activityEnabled = false;
let synth = new Tone.Synth().toDestination();

// fetch initial game state and reset UI
const resetGame = async () => {
    // set game into idle-state
    disableActivity();
    document.getElementById("failure-modal").style.display = "none";
    document.getElementById("start-btn").disabled = false;
    const { highScore, level, sequence: gameSequence } = await getGameState();
    sequence = gameSequence.map((color) => { return "pad-" + color });
    
    userSequence = [];
    updateUI({ level, highScore });
};

// get gameState from backend by perfoming a PUT request
const getGameState = async () => {
    try {
        const response = await axios.put("http://localhost:3000/api/v1/game-state");
        return response.data.gameState; // when successful, extract data
    } catch (error) {
        console.log("Error when fetching gameState", error);
    }
};

// initalizes the start of the game
const startGame = async () => {
    enableActivity();
    document.getElementById("start-btn").disabled = true;
    await playSequence();
};

const disableActivity = () => { toggleActivity(false) };
const enableActivity = () => { toggleActivity(true) };
const toggleActivity = (enabled) => {
    document.querySelectorAll(".pad, #replay-btn").forEach((button) => { button.disabled = !enabled });
    document.getElementById("sound-select").style.pointerEvents = enabled? "auto" : "none";
    activityEnabled = enabled;
    if (enabled) { document.addEventListener('keyup', handleKeyUp); }
    else { document.removeEventListener('keyup', handleKeyUp) }
};

// pad press function
const pressPad = async (padId) => {
    playSound(padId);
    userSequence.push(padId);
    
    // user can't replay sequence after beginning (pressingPads) the level
    if (userSequence.length > 0) { document.getElementById("replay-btn").disabled = true; }
    if (sequence.length === userSequence.length) {
        await advanceLevel(userSequence);
    }
};

// plays sound for each pad press (as well when the sequence is playing)
const playSound = (padId) => {
    synth.oscillator.type = document.getElementById("sound-select").value;
    synth.triggerAttackRelease(noteForPads[padId], "8n", Tone.now());
};

// check if userSequence is valid (the same as the computer generated sequence)
const advanceLevel = async (currentUserSequence) => {
    userInput = currentUserSequence.map((padId) => padId.replace(/pad-/, "")); // turn padId into colors
    const gameState = await validateUserSequence(userInput);
    if (!gameState) { return; }
    
    level = gameState.level;
    highScore = gameState.highScore;
    highScore = Math.max(highScore, level - 1);
    userSequence = []; // reset for next lvl
    sequence = gameState.sequence.map((color) => { return "pad-" + color });
    updateUI({ level, highScore });
    await playSequence();
};

// check if userSequence is correct using backend by perfoming a PUT request
const validateUserSequence = async (userSequence) => {
    try {
        const response = await axios.post(
            "http://localhost:3000/api/v1/game-state/sequence",
            { sequence: userSequence }
        );
        return response.data.gameState;
    } catch (error) {
        if (error.response.status === 400) {
            // user sequence is wrong
            activityEnabled = false;
            document.getElementById("failure-modal").style.display = "flex";
        } else {
            // post error
            console.log("Error validating user input", error);
        }
    }
};

const playSequence = () => {
    disableActivity();
    setTimeout(() => {
        // track when sequence finishes playing
        let totalDelay = 0;
        
        sequence.forEach((padId, index) => {
            const padDelay = index * 900; // ms between each pad highlight
            setTimeout(() => {
                // highlight pad
                const pad = document.getElementById(padId);
                pad.classList.add("active");
                playSound(padId);
                
                // highlight duration is 350ms
                setTimeout(() => { pad.classList.remove("active") }, 350);
            }, padDelay);
            totalDelay = padDelay + 350; // calculate total delay to know when to enable activity
        });
        // enable UI after sequence finishes playing
        setTimeout(() => {
            enableActivity();
            document.getElementById("start-btn").disabled = true;
        }, totalDelay + 100);
    }, 1600); // initial 1600ms delay
};

const highlightPad = async (padId) => {
    if (!activityEnabled) { return; }
    const pad = document.getElementById(padId);
    pad.classList.add("active");
    pressPad(padId);
    
    setTimeout(() => {
        // remove highlight after 350 ms
        document.getElementById(padId).classList.remove("active");
    }, 350);
};

// keyboard controls
const handleKeyUp = async (e) => {
    if (!activityEnabled) { return; }
    const padId = keyToPad[e.key];
    if (padId) {
        pressPad(padId);
        await document.getElementById(padId).classList.remove("active");
    }
};
const handleKeyDown = (e) => {
    if (!activityEnabled) { return; }
    const padId = keyToPad[e.key];
    if (padId) {
        document.getElementById(padId).classList.add("active");
    }
};

document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keydown", handleKeyDown);

// helper functions
const updateUI = ({ level, highScore }) => {
    document.getElementById("level-indicator").textContent = level;
    document.getElementById("high-score").textContent = highScore;
};

window.onload = () => {
    resetGame();
};