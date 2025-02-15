// window.localstorage ----- til að geyma high score




// give each pad a unique keyboard key
const keyToPad = {
    q: "pad-red",
    w: "pad-yellow",
    a: "pad-green",
    s: "pad-blue"
};
let padSequence = [] // TODO: vtk hvort ég ætli að initaliza þetta hér..
let level = 1; // TODO: starts at lvl 1
let padSeqIndex = 0
let isKeyboardEnabled = false

// const synth = new Tone.Synth().toDestination(); // TEST






// idle-state, all buttans except the start-btn are disabled
const resetGame = () => {
    padSequence = [];
    level = 1;
    disableButtons();
    document.getElementById("start-btn").disabled = false;
    console.log("Game reset to idle state"); // DELETE console
}

// all buttons are enabled and the start-btn is disabled
const startGame = () => {
    enableButtons();
    document.getElementById("start-btn").disabled = true;

    addToSequence();
    playSequence();


// TODO The frontend plays the sequence by lighting up pads and playing sounds with reasonable interval.
// TODO The tone style that is played must be the one that is selected in the dropdown menu.
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
    console.log(padId + " was pressed");
    // make sound
    // save pressPad --- compare it with padSequences
    // We initialise the synthesiser
    playSound();
    padSeqIndex += 1;

    checkMatch(padId); // check if pad press was correct
    addToSequence() // add if necesary
}

const playSound = () => {
    // get the select elements
    const sounds = document.getElementById("sound-select");
    // get the selected sound
    const selectedSound = sounds.value; // "sine" |"square" | "triangle"


    // PLAY THE SOUND
    // const now = Tone.now(); // get time
    // synth.triggerAttackRelease("c4", "8n", now); // play note

}


const checkMatch = (padId) => {
    // check if userInput matches padSequence


    // if it matches: continue with game (get another color to the sequence)

    // if it doesn't match: make failure msg appear + restart button
}

const addToSequence = () => { // TODO: kannski ekkki fall - lookar stupid
    if (padSequence.length === padSeqIndex) {padSequence.push(getRandomPad())};
}
    // play the pad-sequence
const playSequence = (e) => {
    console.log(padSequence)
    // padSequence.forEach(padId => {}) 

    console.log("play sequence was pressed");
};

const getRandomPad = () => {
    // get values from object
    const padValues = Object.values(keyToPad);
    // randomize index
    let i = Math.floor(Math.random() * padValues.length);
    // get and return a random pad from the index
    let randomPad = padValues[i];
    return randomPad;
}


// play tune when pressed and animate pad
document.addEventListener("keyup", (e) => {
    if (! isKeyboardEnabled) {return};
    padId = keyToPad[e.key]
    if (padId) {
        pressPad(padId);
        document.getElementById(padId).classList.remove("clickKey");
        console.log("GOING THROUGH")
    }
});

// turns pad back to original look
document.addEventListener("keydown", (e) => {
    if (! isKeyboardEnabled) {return};
    if (keyToPad[e.key]) {
        document.getElementById(keyToPad[e.key]).classList.add("clickKey")
    }
});

// const keyPressPad = (e) => {
//      // find corresponding pad-id from key
//     const padId = keyToPad [e.key];
//     if (padId) { // if valid key is pressed
//         const pad = document.getElementById(padId);
//         animatePadPress(padId);
//         pressPad(padId);
//     };
// }
// const animatePadPress = (padId) => {
//     const pad = document.getElementById(padId);
//     pad.classList.add("clickKey"); // enables pad:active
//     setTimeout(() => {
//         pad.classList.remove("clickKey"); // disables pad:active
//     }, 190); // animate press for 190ms
// }


// user changes pad-press-sound
// document.getElementById('my_drop_down').selectedIndex=2;
















const validateUserInput = () => {
    // check if user input is == to the sequence
    // • If the input is correct, the game progresses with an extended sequence.
    // • If the input is incorrect, a failure message (modal) appears, allowing the player to start a new game.
};


const showFailureMessage = () => {
    // showed when user input is incorrect
};


const getHighScore = () => {
    // get high score
    // • If the player achieves a new high score, it updates dynamically on the screen.
};




resetGame() // TODO: so that each time page loads, it calls resetGame instead of disabledButtons()
