// window.localstorage ----- til að geyma high score
// HELP: TA --- eiga sequence að breytast í hverju lvl, ég hélt að runan ætti að vera nákæmlega eins nema bæta einnum pad við??



// give each pad a unique keyboard key
const keyToPad = {
    q: "red",
    w: "yellow",
    a: "green",
    s: "blue"
};
const toneForPads = {
    "red": "c4",
    "yellow": "e4",
    "green": "d4",
    "blue": "f4"
}



let sequence = [] // TODO: vtk hvort ég ætli að initaliza þetta hér..
let level = 1; // initalized at 1
let highScore = 0;

let userPadPressCount = 0 // for each lvl
let isKeyboardEnabled = false
let isSequencePlaying = false;

// const synth = new Tone.Synth().toDestination(); // BUG





// idle-state, all buttans except the start-btn are disabled

// HELP ÁRIÐANDI -- contact the backend here ??
//  HELP reset by contacting the backend
//  HELP retrieve the highscore
const resetGame = async () => {
    // get game info
    const gameState = await putGameState()
    highScore = gameState.highScore
    level = gameState.level
    sequence = gameState.sequence
    console.log(sequence)
    const seq = sequence.map(color => {return "pad-" + color})
    console.log(seq)

    userPadPressCount = 0 // MAYBE DELETE

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
    // the URL to which we will send the request
    const url = "http://localhost:3000/api/v1/game-state";
    // perform a PUT request to the url
    try {
      const response = await axios.put(url);
      // when successful, extract data
      return response.data.gameState
    } catch (error) {
      // when unsuccessful, print the error.
      console.log(error);
    }
  };


  
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
    userPadPressCount++;
    playTone(padId);

    checkMatch(padId, userPadPressCount); // check if pad press was correct
}

const playTone = (padId) => {
    const sounds = document.getElementById("sound-select");
    const selectedSound = sounds.value; // "sine" |"square" | "triangle"

    // // PLAY THE SOUND
    // note = toneForPads[padId];
    // synth.triggerAttackRelease(note,"8n", Tone.now());
    // TODO
}

// check if userInpust is the same as sequence (continnue game if True else game over)
// HELP ÁRIÐANDI -- contact the backend here ??
const checkMatch = (padId, userPadPressCount) => {
    if (sequence[userPadPressCount - 1] != padId) { // if the pad pressed is incorrect
        document.getElementById("failure-modal").style.display = "flex";
        isKeyboardEnabled = false;
    } else if (sequence.length === userPadPressCount) {
        advanceLevel();
        addToSequence();
        playSequence();
    }
}

// make sequence longer if player presses right pads
const advanceLevel = () => {
        // update level-indicator
        level++;
        document.getElementById("level-indicator").innerHTML = level;
        // update high-score if necessary
        if (level > highScore) {
            highScore = level;
            document.getElementById("high-score").innerHTML = highScore;
            window.localStorage.setItem("high-score", highScore) // save highscore in backend
        };
    };

const addToSequence = () => {
    sequence.push(getRandomPad());
    userPadPressCount = 0; // reset for next level
}


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