




const resetGame = () => {
// reset Game
    score = 0;
    selectedCards = [];
};

const randomColorSequence = () => {
    // randomize color sequence
}



const pressColorPads = (event) => {
    console.log("A color pad was pressed!");
    document.pad.active = true;

}

// Get all buttons with the class "colorButton"
const colorPads = document.querySelectorAll('.pad');

// Add an event listener to each button
colorPads.forEach(button => {
    button.addEventListener('click', pressColorPads);
});



//     if (selectedCards.length < 2 && !card.classList.contains("matched")) {
//       selectedCards.push(card);
//     }
//     if (selectedCards.length === 2) {
//       setTimeout(checkMatch, 500);
//     }
//   };
  
//   const checkMatch = () => {
//     const [card1, card2] = selectedCards;
//     if (card1.dataset.emoji === card2.dataset.emoji) {
//       card1.classList.add("matched");
//       card2.classList.add("matched");
//       matchedPairs++;
//       if (matchedPairs === emojis.length / 2) {
//         setTimeout(() => alert("You win!"), 300);
//       }
//     } else {
//       card1.innerText = "❓";
//       card2.innerText = "❓";
//     }
//     selectedCards = [];
//   };