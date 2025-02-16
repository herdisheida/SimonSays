// window.localstorage ----- til að geyma high score
// HELP: TA --- eiga sequence að breytast í hverju lvl, ég hélt að runan ætti að vera nákæmlega eins nema bæta einnum pad við??

// TODO advanceLevel BACKEND
// TODO 

// give each pad a unique keyboard key
const keyToPad = {
    q: "pad-red",
    w: "pad-yellow",
    a: "pad-green",
    s: "pad-blue"
};
const toneForPads = {
    "pad-red": "c4",
    "pad-yellow": "e4",
    "pad-green": "d4",
    "pad-blue": "f4"
}


// TODO: vtk hvort ég ætli að initaliza þetta hér..
let sequence = []
let userSequence = []
let level = 1; // initalized at 1
let highScore = 0;

// let userPadPressCount = 0 // for each lvl
let isKeyboardEnabled = false
let isSequencePlaying = false;

// const synth = new Tone.Synth().toDestination(); // BUG





// idle-state, all buttans except the start-btn are disabled
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
    disableButtons();
    document.getElementById("failure-modal").style.display = "none";
    document.getElementById("start-btn").disabled = false;
    console.log("Game reset to idle state"); // DELETE console
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


  
// all buttons are enabled and the start-btn is disabled
const startGame = () => {
    enableButtons();
    document.getElementById("start-btn").disabled = true;
    // addToSequence();
    playSequence();

    console.log("game has started") // DELETE
    // synth = new Tone.Synth().toDestination();  // TEST
}

const disableButtons = () => {
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {button.disabled = true});
}
const enableButtons = () => {
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {button.disabled = false});
    isKeyboardEnabled = true;
}


// pad press function
const pressPad = (padId) => {
    if (isSequencePlaying) {return};

    console.log(padId + " was pressed"); // DELETE
    playTone(padId);

    userSequence.push(padId);
    if (sequence.length === userSequence.length) {advanceLevel(userSequence)}

    
    console.log("user " + userSequence)
    console.log("seq " + sequence)

}

const playTone = (padId) => {
    const sounds = document.getElementById("sound-select");
    const selectedSound = sounds.value; // "sine" |"square" | "triangle"

    // // PLAY THE SOUND
    // note = toneForPads[padId];
    // synth.triggerAttackRelease(note,"8n", Tone.now());
    // TODO
}

// check if userSequence is valid (the same as the computer generated sequence)
const advanceLevel = async (currentUserSequence) => {
    userInput = currentUserSequence.map(padId => padId.replace(/pad-/, "")) // turn padId into colors
    const gameState = await postGameSequence(userInput)
    
    // get gameState info
    level = gameState.level
    highScore = gameState.highScore
    // update info
    if ((level - 1) > highScore) {highScore = level - 1};
    // userPadPressCount = 0 // reset for next lvl
    userSequence = []  // reset for next lvl

    // show updated info
    document.getElementById("level-indicator").innerHTML = level;
    document.getElementById("high-score").innerHTML = highScore;

    sequence = gameState.sequence.map(color => {return "pad-" + color}) // set elem in array to padIds
    playSequence();
}

// check if user from backend by perfoming a PUT request
const postGameSequence = async (userSequence) => {
    // format userSequence for POST request
    const url = "http://localhost:3000/api/v1/game-state/sequence"; // the URL for the request
    try {
        const response = await axios.post(url, { sequence: userSequence }); // Sending a POST request with data
        return response.data.gameState
    } catch (error) {
        // HELP TA --- á ég að setja failure hérna ? því +eg fæ alltaf error þegar ég geri rangt seqeuence
        document.getElementById("failure-modal").style.display = "flex";
        isKeyboardEnabled = false;
    };
}


// const addToSequence = () => {
//     sequence.push(getRandomPad());
//     userPadPressCount = 0; // reset for next level
// }


// play generated pad sequence
const playSequence = async () => {
    isSequencePlaying = true;
    // create an array of pad's animations
    const padPromises = sequence.map((padId, index) => 
        new Promise((resolve) => {
            setTimeout(async () => {
                // get pad info
                const pad = document.getElementById(padId);
                
                await new Promise(r => setTimeout(r, 800)); // delay before highliting
                pad.classList.add("clickKey"); // highlight pad
                await new Promise(r => setTimeout(r, 500)); // highlight duration
                pad.classList.remove("clickKey"); // remove highlight
        
                resolve(); // mark the pad's animation as finished
            }, index * 1000); // start each pad animation with 1sec interval
        })
    );
    // wait for sequence to complete
    await Promise.all(padPromises);
    isSequencePlaying = false;
    console.log("Sequence complete!"); // DELETE
};

// generate and return random pad to add to the sequence
const getRandomPad = () => {
    const padValues = Object.values(keyToPad); // get values from object
    let i = Math.floor(Math.random() * padValues.length); // randomize index
    return padValues[i]; // return a random pad
}


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


resetGame() // TODO --- fix this look -- contact the backend stuff