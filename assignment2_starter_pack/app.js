// window.localstorage ----- til að geyma high score




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



let padSequence = [] // TODO: vtk hvort ég ætli að initaliza þetta hér..
let level = 1; // TODO: starts at lvl 1
let userPadPressCount = 0 // for each lvl
let isKeyboardEnabled = false
let isSequencePlaying = false;

// const synth = new Tone.Synth().toDestination(); // BUG






// idle-state, all buttans except the start-btn are disabled
const resetGame = () => {
    padSequence = [];
    level = 1;
    userPadPressCount = 0

    disableButtons();
    document.getElementById("failure-modal").style.display = "none";
    document.getElementById("start-btn").disabled = false;
    console.log("Game reset to idle state"); // DELETE console

}

// all buttons are enabled and the start-btn is disabled
const startGame = () => {
    enableButtons();
    document.getElementById("start-btn").disabled = true;
    addToSequence();

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

    console.log("TEST") // DELETE
    console.log(padSequence)

}

const playTone = (padId) => {
    const sounds = document.getElementById("sound-select");
    const selectedSound = sounds.value; // "sine" |"square" | "triangle"

    // // PLAY THE SOUND
    // note = toneForPads[padId];
    // synth.triggerAttackRelease(note,"8n", Tone.now());
    // TODO
}

// check if userInpust is the same as padSequence (continnue game if True else game over)
const checkMatch = (padId, userPadPressCount) => {
    if (padSequence[userPadPressCount - 1] === padId) {
        level++;
        addToSequence();
    } else {
        document.getElementById("failure-modal").style.display = "flex";
        isKeyboardEnabled = false;
    };
}

// make sequence longer if player presses right pads
const addToSequence = () => {

    console.log("TESTING AFTER RESET")
    console.log(padSequence.length)
    console.log(userPadPressCount)


    if (padSequence.length === userPadPressCount) {
        padSequence.push(getRandomPad());
        playSequence();
        userPadPressCount = 0; // reset for next level
    };
}
    // play the pad-sequence
const playSequence = () => {
    isSequencePlaying = true;
    // console.log(padSequence); // DELETE
    const highlightPadDuration = 200 // the time pad is animated
    const intervalBetweenPads = 1000

    padSequence.forEach((padId, index) => {
        const pad = document.getElementById(padId)

        setTimeout(() => {
            pad.classList.add("clickKey"); // highlight pad
        
        setTimeout(() => {
            pad.classList.remove("clickKey") // remove highlight after duration
        }, highlightPadDuration)
        
        }, index * intervalBetweenPads);
    });

    isSequencePlaying = false;
    console.log("play sequence!!!");
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

// const keyPressPad = (e) => {
//      // find corresponding pad-id from key
//     const padId = keyToPad [e.key];
//     if (padId) { // if valid key is pressed
//         const pad = document.getElementById(padId);
//         animatePadPress(padId);
//         pressPad(padId);
//     };
// }
const animatePadPress = (padId) => {
    const pad = document.getElementById(padId);
    pad.classList.add("clickKey"); // enables pad:active
    setTimeout(() => {
        pad.classList.remove("clickKey"); // disables pad:active
    }, 190); // animate press for 190ms
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
