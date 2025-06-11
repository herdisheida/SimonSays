# Simon Says Game 🎮


![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

![Uses Tone.js](https://img.shields.io/badge/Uses-Tone.js-blue)
![Axios HTTP](https://img.shields.io/badge/HTTP_AJAX-Axios-green)

A web implementation of the classic Simon memory game, developed for Web Programming I (T-213-VEFF) at Reykjavik University.



## 🎯 Features
- **Interactive gameplay** with both mouse and keyboard (Q,W,A,S) support
- **Dynamic sequence generation** from backend API
- **Audio feedback** using Tone.js with different tone styles
- **High score tracking** with automatic updates
- **Replay functionality** to review sequences
- **Responsive design** that works on modern browsers



## 🚀 Installation & Setup
1. Clone the repository:
```bash
git clone https://github.com/herdisheida/P6-Wordle
```
2. Go to the projects directory
```bash
cd <your-simaon-says-folder>
```
3. Start the backend server (required for game logic):
```bash
cd assignment2_backend
npm install
npm start
```
3. Open the game in your browser by launching index.html or by using the link from [myDeploymentUrl.txt](/assignment2/myDeploymentUrl.txt) file





## 🎮 How to Play

1. Select your preferred tone style from the dropdown

2. Click "Start" to begin the game

3. Watch and listen to the sequence of tones

4. Repeat the sequence by clicking the colored pads or using keys:
* 🔴 Red (Q)
* 🟡 Yellow (W)
* 🟢 Green (A)
* 🔵 Blue (S)

5. Progress through levels by correctly repeating longer sequences

6. Use "Replay" to hear the current sequence again