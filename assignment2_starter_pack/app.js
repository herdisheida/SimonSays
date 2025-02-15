// window.localstorage ----- til að geyma high score




// give each pad a unique keyboard key
const padKeys = {
    q: "pad-red",
    w: "pad-yellow",
    a: "pad-green",
    s: "pad-blue"
};
let padSequence = [] // TODO: vtk hvort ég ætli að initaliza þetta hér..
let level = 1; // TODO: starts at lvl 1
let padSeqIndex = 0





// when page is reloaded or opened for the first time
const resetGame = () => {
    padSequence = []
    level = 1

    // disable all buttons except the start-btn
    disableButtons();
    document.getElementById("start-btn").disabled = false;
    console.log("Game reset to idle state"); // DELETE console
}

const startGame = () => {
    // enable all buttons and disable the start-btn
    enableButtons();
    document.getElementById("start-btn").disabled = true;

    addToSequence() // TEST

    // put focus on a pad, in order for keyboard to work simulatnioutsly
    document.getElementById("pad-red").focus() // TODO: FIX THIS UGLY THING -- it works but ugly

    console.log("Game has started") // DELETE console

// TODO The frontend plays the sequence by lighting up pads and playing sounds with reasonable interval.
// TODO The tone style that is played must be the one that is selected in the dropdown menu.
}

const disableButtons = () => {
    // disable all button elements
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {button.disabled = true});
    // disable keyboard
    document.onkeydown = () => {return false};
}
const enableButtons = () => {
    // enable all button elements
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {button.disabled = false});
    // enable keyboard
    document.onkeydown = () => {return true};
}


// pad press function
const pressPad = (padId) => {
    console.log(padId + " was pressed");
    // make sound
    // save pressPad --- compare it with padSequences
    // We initialise the synthesiser
    // playTune();
    padSeqIndex += 1

    checkMatch(padId); // check if pad press was correct
    addToSequence() // add if necesary
}

const playTune = (e) => {
    let sound = document.getElementById("sound-select")
    // PLAY SOMETHING
}


const checkMatch = (padId) => {
    // check if userInput matches padSequence


    // if it matches: continue with game (get another color to the sequence)

    // if it doesn't match: make failure msg appear + restart button
}

const addToSequence = () => { // TODO: kannski ekkki fall - lookar stupid
    if (padSequence.length === padSeqIndex) {
        padSequence.push(getRandomPad());
        playSequence() // play new sequence
    };
}
    // play the pad-sequence
const playSequence = (e) => {
    console.log(padSequence)
    // padSequence.forEach(padId => {}) 

    console.log("Replay button was pressed");
};

const getRandomPad = () => {
    // get values from object
    const padValues = Object.values(padKeys);
    // randomize index
    let i = Math.floor(Math.random() * padValues.length);
    // get and return a random pad from the index
    let randomPad = padValues[i];
    return randomPad;
}




const animatePadPress = (padId) => {
        const pad = document.getElementById(padId);
        pad.classList.add("clickKey"); // enables pad:active
        setTimeout(() => {
            pad.classList.remove("clickKey"); // disables pad:active
        }, 190); // delayd by 190ms
}

const keyPressPad = (e) => {
     // find corresponding pad-id from key
    const padId = padKeys [e.key];
    if (padId) { // if valid key is pressed
        const pad = document.getElementById(padId);
        animatePadPress(padId)
        pressPad(padId);
    };
}


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
