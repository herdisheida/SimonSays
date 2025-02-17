// give each pad a unique keyboard key
const keyToPad = {
    q: "pad-red",
    w: "pad-yellow",
    a: "pad-green",
    s: "pad-blue"
};
const noteForPads = {
    "pad-red": "C4",
    "pad-yellow": "D4",
    "pad-green": "E4",
    "pad-blue": "F4"
}


// TODO: vtk hvort ég ætli að initaliza þetta hér..
let sequence;
let userSequence = [];
let level;
let highScore;

let isKeyboardEnabled = false;
let isSequencePlaying = false;

let synth = new Tone.Synth().toDestination();    



// idle-state: all buttans except the start-btn are disabled, get info from backend for the "reset"
const resetGame = async () => {
    // get and set game info
    const gameState = await putGameState()
    highScore = gameState.highScore
    level = gameState.level
    sequence = gameState.sequence.map(color => {return "pad-" + color}) // set elem in array to padIds
    userSequence = []

    // display game info
    document.getElementById("level-indicator").innerHTML = level;
    document.getElementById("high-score").innerHTML = highScore;
    // set game into idle-state
    disableActivity();
    document.getElementById("failure-modal").style.display = "none";
    document.getElementById("start-btn").disabled = false;
}

// get gameState from backend by perfoming a PUT request
const putGameState = async () => {
    const url = "http://localhost:3000/api/v1/game-state"; // the URL for the request
    try {
      const response = await axios.put(url);
      return response.data.gameState; // when successful, extract data
    } catch (error) {
      console.log(error); // when unsuccessful, print the error.
    };
}
  
// initalizes the start of the game, all buttons are enabled and the start-btn is disabled
const startGame = () => {
    enableActivity();
    document.getElementById("start-btn").disabled = true;
    playSequence();
}


const disableActivity = () => {
    document.querySelectorAll("button").forEach(button => {button.disabled = true});
    isKeyboardEnabled = false;
    document.getElementById("sound-select").classList.add('disabled');
}
const enableActivity = () => {
    document.querySelectorAll("button").forEach(button => {button.disabled = false});
    isKeyboardEnabled = true;
    document.getElementById("sound-select").classList.remove('disabled');
}


// pad press function
const pressPad = async (padId) => {
    if (isSequencePlaying) {return}; // cannot press pad if sequence is playing
    playSound(padId);

    userSequence.push(padId);
    // disable replay-btn when user has started pressing color-pads
    if (userSequence.length > 0) {document.getElementById("replay-btn").disabled = true}
    // validate userInput
    if (sequence.length === userSequence.length) {advanceLevel(userSequence)};

}

// plays sound for each pad press (as well when the sequence is playing)
const playSound = (padId) => {
    // get and change sound selector
    const sounds = document.getElementById("sound-select");
    const selectedSound = sounds.value;
    synth.oscillator.type = selectedSound
    // get corresponding note for pad
    note = noteForPads[padId];
    // make sound
    synth.triggerAttackRelease(note,"5n", Tone.now());
}


// check if userSequence is valid (the same as the computer generated sequence)
const advanceLevel = async (currentUserSequence) => {
    userInput = currentUserSequence.map(padId => padId.replace(/pad-/, "")) // turn padId into colors    
    // get gameState info
    const gameState = await validateUserSequence(userInput)
    level = gameState.level
    highScore = gameState.highScore
    // update info
    if ((level - 1) > highScore) {highScore = level - 1};
    userSequence = []  // reset for next lvl
    document.getElementById("replay-btn").disabled = true // enable replay-btn for next lvl
    // show updated info
    document.getElementById("level-indicator").innerHTML = level;
    document.getElementById("high-score").innerHTML = highScore;

    sequence = gameState.sequence.map(color => {return "pad-" + color}) // set elem in array to padIds
    playSequence();
}


// check if userSequence is correct using backend by perfoming a PUT request
const validateUserSequence = async (userSequence) => {
    // format userSequence for POST request
    const url = "http://localhost:3000/api/v1/game-state/sequence"; // the URL for the request
    try {
        // sending a POST request with data
        const response = await axios.post(url, {sequence: userSequence});
        return response.data.gameState
    } catch (error) { // if user inputs wrong sequence
        document.getElementById("failure-modal").style.display = "flex";
        isKeyboardEnabled = false;
    };
}


// play generated pad sequence
const playSequence = async () => {
    isSequencePlaying = true;
    document.getElementById("replay-btn").disabled = true; // right when sequence starts playing
    // create an array of pad's sequence
    const padPromises = sequence.map((padId, index) => 
        new Promise((resolve) => {
            setTimeout(async () => {                
                await new Promise(r => setTimeout(r, 1800)); // delay before highliting   
                disableActivity(); // whilst sequence is playing (code is here, otherwise it interfers with the user's last padPress)
 
                // highlight pad
                const pad = document.getElementById(padId);
                pad.classList.add("clickKey");
                playSound(padId)
                await new Promise(r => setTimeout(r, 350)); // highlight duration
                pad.classList.remove("clickKey");
        
                resolve(); // mark the pad's animation as finished
            }, index * 900); // 900ms interval between each pad highlight
        })
    );
    // wait for sequence to complete
    await Promise.all(padPromises);
    isSequencePlaying = false;
    // reset for next lvl
    enableActivity();
    document.getElementById("start-btn").disabled = true;
};


// play tune when pressed and animate pad
document.addEventListener("keyup", (e) => {
    if (! isKeyboardEnabled || isSequencePlaying) {return};
    padId = keyToPad[e.key];
    if (padId) {
        pressPad(padId);
        document.getElementById(padId).classList.remove("clickKey");
    };
});
// turns pad back to original look
document.addEventListener("keydown", (e) => {
    if (! isKeyboardEnabled || isSequencePlaying) {return};
    if (keyToPad[e.key]) {
        document.getElementById(keyToPad[e.key]).classList.add("clickKey");
    };
});


resetGame()