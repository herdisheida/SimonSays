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
    
    // get and set game info
    const gameState = await getGameState();
    highScore = gameState.highScore;
    level = gameState.level;
        // set the elements in the array to padIds
    sequence = gameState.sequence.map((color) => { return "pad-" + color; });
    userSequence = [];
    updateUI({ level, highScore})
};

// get gameState from backend by perfoming a PUT request
const getGameState = async () => {
    const url = "http://localhost:3000/api/v1/game-state"; // the URL for the request
    try {
        const response = await axios.put(url);
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
const disableActivity = () => {
    document.querySelectorAll(".pad, #replay-btn").forEach((button) => {
        button.disabled = true;
    });
    document.getElementById("sound-select").style.pointerEvents = "none";
    activityEnabled = false;
};
const enableActivity = () => {
    document.querySelectorAll(".pad, #replay-btn").forEach((button) => {
        button.disabled = false;
    });
    document.getElementById("sound-select").style.pointerEvents = "auto";
    activityEnabled = true;
};

// pad press function
const pressPad = async (padId) => {
    playSound(padId);
    userSequence.push(padId);
    
    // user can't replay sequence after beginning (pressingPads) the level
    if (userSequence.length > 0) {
        document.getElementById("replay-btn").disabled = true;
    }
    // validate userInput
    if (sequence.length === userSequence.length) {
        activityEnabled = false; // block user input whilst sequence is playing
        advanceLevel(userSequence);
        activityEnabled = true;
    }
};

// plays sound for each pad press (as well when the sequence is playing)
const playSound = (padId) => {
    // get sound type
    const soundSelector = document.getElementById("sound-select");
    synth.oscillator.type = soundSelector.value;
    // get tone for corrasponding pad
    let note = noteForPads[padId];
    synth.triggerAttackRelease(note, "8n", Tone.now());
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
    updateUI({ level, highScore})
    await playSequence();
};

// check if userSequence is correct using backend by perfoming a PUT request
const validateUserSequence = async (userSequence) => {
    const url = "http://localhost:3000/api/v1/game-state/sequence"; // the URL for the request
    try {
        // sending a POST request with data
        const response = await axios.post(url, { sequence: userSequence });
        return response.data.gameState;
    } catch (error) {
        if (error.response.status === 400) {
            // if user inputs wrong sequence
            document.getElementById("failure-modal").style.display = "flex";
        } else {
            // request error
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
                const pad = document.getElementById(padId);
                // highlight pad
                pad.classList.add("active");
                playSound(padId);
                // highlight duration is 350ms
                setTimeout(() => { pad.classList.remove("active"); }, 350);
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
    document.getElementById(padId).classList.add("active");
    pressPad(padId)
    await new Promise((r) => setTimeout(r, 350)); // highlight duration
    document.getElementById(padId).classList.remove("active");
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
    const padId = keyToPad[e.key]
    if (padId) { document.getElementById(padId).classList.add("active"); }
};

document.addEventListener("keyup", handleKeyUp)
document.addEventListener("keydown", handleKeyDown)


// helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const updateUI = ({ level, highScore }) => {
    document.getElementById("level-indicator").textContent = level;
    document.getElementById("high-score").textContent = highScore;
};


window.onload = () => {
    resetGame();
};