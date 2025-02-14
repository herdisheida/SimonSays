// window.localstorage ----- til að geyma high score




// give each pad a unique keyboard key
const padKeys = {
    q: "pad-red",
    w: "pad-yellow",
    a: "pad-green",
    s: "pad-blue"
};





// WHEN PAGE IS LOADED

const resetGame = () => {
    let level = 1; // starts at lvl 1

    resetButton.addEventListener("click", () => { // TODO: CHANGE THIS THING
        disableButtons();
    })
    console.log("Game reset to idle state")
    }


// disable all buttons, except the start-btn
const disableButtons = () => {
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {
        if (button.id != "start-btn")
            button.disabled = true;
        })
    // disable keyboard
    document.onkeydown = () => {
        return false;
    }
}

// enable all game-activity, except start-button
const enableButtons = () => {
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {
        button.disabled = false;
    })
    // enable keyboard
    document.onkeydown = () => {
        return true;
    }

}


// user presses start-btn
const startGame = () => {
    console.log("Game has started")

    // start Game
    // able to press everything -- (replau button, no longer disabled)

    // enable buttons
    enableButtons();
    // disable start button
    const startBtn = document.getElementById("start-btn");
    startBtn.disabled = true;

    document.getElementById("pad-red").focus() // TODO: FIX THIS UGLY THING -- it works but ugly


// • The frontend plays the sequence by lighting up pads and playing sounds with reasonable interval.
// • The tone style that is played must be the one that is selected in the dropdown menu.
// • The player must repeat the sequence by clicking the game-pads or using the keyboard (Q, W, A, S ).
}




// user presses the start button
document.getElementById("start-btn").addEventListener("click", (e) => {
    console.log("Start button was pressed")
    startGame(e)
});

// user presses a pad
document.getElementById("game-board").addEventListener("click", (e) => {
    console.log("Pad was pressed");
    pressPad(e.target.id);
});




// Track cooldowns for each pad
const cooldownPads = new Set(); // Stores IDs of pads in cooldown
// user presses a pad using a KEY - on the click
document.getElementById("game-board").addEventListener("keydown", (e) => {
    const padId = padKeys [e.key];
    if (padId) {
        const pad = document.getElementById(padId);
        pad.focus() // make sure, the key is pressed


        // prevent pads from being spammed, by having a 1 second cooldown after each press
        // TODO: MIGHT DELETE
        if (cooldownPads.has(padId)) {
            e.preventDefault(); // Optional: Block the action
            console.log("Pad is in cooldown!");
            return;
        }
        cooldownPads.add(padId);
        pad.classList.add("cooldown");
        setTimeout(() => {
            cooldownPads.delete(padId);
            pad.classList.remove("cooldown");
        }, 300); // 300ms = 5s


        // functionality of the button
        pad.classList.add("clickKey");
        pressPad(pad.id);
        console.log(e.key, "KEY WAS PRESSED")
    };
});
// user releases a pad using a KEY
document.getElementById("game-board").addEventListener("keyup", (e) => {
    const padId = padKeys [e.key]
    if (padId) {
        const pad = document.getElementById(padId);
        pad.classList.remove("clickKey");
    };
});


// user presses the replay button (a sequence is repeated)
document.getElementById("replay-btn").addEventListener("click", (e) => {
    console.log("Replay button was pressed");
    replaySequence(e);
});

// user presses the reset button
document.getElementById("reset-btn").addEventListener("click", (e) => {
    console.log("Reset button was pressed");
    resetGame(e);
});


// user changes pad-press-sound
// document.getElementById('my_drop_down').selectedIndex=2;





const getRandomPad = () => {
    // get values from object
    const padValues = Object.values(padKeys)
    // randomize index
    let i = Math.floor(Math.random() * padValues.length)
    // get and return a random pad from the index
    let randomPad = padValues[i]
    return randomPad
}


// pad press function
const pressPad = (pad) => {
    console.log(pad + " was pressed")
    // make sound
    // save pressPad --- compare it with padSequences


}















const playRandomColorSequence = () => {
    // play color sequence
};

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

const replaySequence = () => {
    // replay the sequence
};













disableButtons(); // TODO: add this --- so that each time page loads, it calls resetGame instead of disabledButtons()
