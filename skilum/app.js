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

let sequence;
let userSequence = [];
let level;

let isKeyboardEnabled = false;
let isBlocked = false; // blocks user presspad input (not keyboard input)

let synth = new Tone.Synth().toDestination();
const soundSelector = document.getElementById("sound-select");

// set game into idle-state and get reset gameState
const resetGame = async () => {
    // get and set game info
    const gameState = await getGameState();
    highScore = gameState.highScore;
    level = gameState.level;
    sequence = gameState.sequence.map((color) => {
        // set the colors in the array to padIds
        return "pad-" + color;
    });
    userSequence = [];
    
    // display game info
    document.getElementById("level-indicator").textContent = level;
    document.getElementById("high-score").textContent = highScore;
    // set game into idle-state
    disableActivity();
    document.getElementById("failure-modal").style.display = "none";
    document.getElementById("start-btn").disabled = false;
};

// get gameState from backend by perfoming a PUT request
const getGameState = async () => {
    const url = "http://localhost:3000/api/v1/game-state"; // the URL for the request
    try {
        const response = await axios.put(url);
        return response.data.gameState; // when successful, extract data
    } catch (error) {
        console.log("error fetching gameState", error);
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
    isKeyboardEnabled = false;
};
const enableActivity = () => {
    document.querySelectorAll(".pad, #replay-btn").forEach((button) => {
        button.disabled = false;
    });
    document.getElementById("sound-select").style.pointerEvents = "auto";
    isKeyboardEnabled = true;
};

// pad press function
const pressPad = async (padId) => {
    if (isBlocked) {
        // return if sequence is playing
        return;
    }
    playSound(padId);
    userSequence.push(padId);
    
    // disable replay-btn when user begins pressing pads for the first time in a level
    if (userSequence.length > 0) {
        document.getElementById("replay-btn").disabled = true;
    }
    // validate userInput
    if (sequence.length === userSequence.length) {
        isBlocked = true; // block user input whilst sequence is playing
        await advanceLevel(userSequence);
        isBlocked = false;
    }
};

// plays sound for each pad press (as well when the sequence is playing)
const playSound = (padId) => {
    // get sound type and corresponding note for pad
    synth.oscillator.type = soundSelector.value;
    let note = noteForPads[padId];
    synth.triggerAttackRelease(note, "8n", Tone.now());
};

// check if userSequence is valid (the same as the computer generated sequence)
const advanceLevel = async (currentUserSequence) => {
    userInput = currentUserSequence.map((padId) => padId.replace(/pad-/, "")); // turn padId into colors
    // get gameState info
    const gameState = await validateUserSequence(userInput);
    level = gameState.level;
    highScore = gameState.highScore;
    // update info
    highScore = Math.max(highScore, level - 1);
    userSequence = []; // reset for next lvl
    document.getElementById("replay-btn").disabled = true; // enable replay-btn for next lvl
    // show updated info
    document.getElementById("level-indicator").textContent = level;
    document.getElementById("high-score").textContent = highScore;
    
    sequence = gameState.sequence.map((color) => {
        // set colors in array to padIds
        return "pad-" + color;
    });
    await playSequence();
};

// check if userSequence is correct using backend by perfoming a PUT request
const validateUserSequence = async (userSequence) => {
    // format userSequence for POST request
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
            console.log("error validating user input", error);
        }
    }
};

// play generated pad sequence
const playSequence = async () => {
    await new Promise((r) => setTimeout(r, 1600));
    disableActivity(); // user can't interact with UI whilst sequence is playing
    // create an array of pad's sequence
    const padPromises = sequence.map(
        (padId, index) =>
            new Promise((resolve) => {
            setTimeout(async () => {
                // highlight pad
                const pad = document.getElementById(padId);
                pad.classList.add("clickKey");
                playSound(padId);
                await new Promise((r) => setTimeout(r, 350)); // highlight duration
                pad.classList.remove("clickKey");
                resolve(); // mark the highlight as finished
            }, index * 900); // 900ms interval between each pad highlight
        })
    );
    
    // wait for sequence to complete
    await Promise.all(padPromises);
    // reset for next lvl
    enableActivity();
    document.getElementById("start-btn").disabled = true;
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms)); // delay by milliseconds

// play tune when pressed and animate pad
document.addEventListener("keyup", async (e) => {
    if (!isKeyboardEnabled) {
        return;
    }
    let padId = keyToPad[e.key];
    if (padId) {
        await pressPad(padId);
        document.getElementById(padId).classList.remove("clickKey");
    }
});
// turns pad back to original look
document.addEventListener("keydown", (e) => {
    if (!isKeyboardEnabled) {
        return;
    }
    if (keyToPad[e.key]) {
        document.getElementById(keyToPad[e.key]).classList.add("clickKey");
    }
});

// reset game when screen is loaded/reloaded
window.onload = () => {
    resetGame();
};
