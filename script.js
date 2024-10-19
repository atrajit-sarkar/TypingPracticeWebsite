let originalText = '';
let startTime, timerInterval;
let totalChars = 0, correctChars = 0, incorrectChars = 0;
let timeLimit = 120; // 2 minutes

// Fetch a random text file from the GitHub repo
async function fetchRandomFile() {
    const repoUrl = 'https://api.github.com/repos/{username}/{repo}/contents/{folder}'; // Replace with your actual repo URL
    const response = await fetch(repoUrl);
    const files = await response.json();
    const txtFiles = files.filter(file => file.name.endsWith('.txt'));
    const randomFile = txtFiles[Math.floor(Math.random() * txtFiles.length)];
    const fileContent = await fetch(randomFile.download_url);
    return fileContent.text();
}

// Load random text and initialize the typing test
async function loadText() {
    originalText = await fetchRandomFile();
    document.getElementById('textToType').innerText = originalText;
    document.getElementById('inputBox').value = '';
    document.getElementById('wpm').innerText = '';
    document.getElementById('accuracy').innerText = '';
    totalChars = 0;
    correctChars = 0;
    incorrectChars = 0;
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = 'Time: 2:00';
}

// Start the typing timer and test
function startTypingTest() {
    if (!startTime) {
        startTime = new Date();
        startTimer();
    }
}

// Timer function
function startTimer() {
    let timeRemaining = timeLimit;
    timerInterval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('timer').innerText = `Time: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            showResults();
        }
    }, 1000);
}

// Track typing, highlight errors, and calculate stats
document.getElementById('inputBox').addEventListener('input', function (e) {
    startTypingTest();
    const userInput = e.target.value;
    totalChars = userInput.length;
    correctChars = 0;
    incorrectChars = 0;
    let displayText = '';

    for (let i = 0; i < originalText.length; i++) {
        if (userInput[i] === originalText[i]) {
            displayText += `<span>${originalText[i]}</span>`;
            correctChars++;
        } else if (userInput[i]) {
            displayText += `<span class="incorrect">${originalText[i]}</span>`;
            incorrectChars++;
        } else {
            displayText += `<span>${originalText[i]}</span>`;
        }
    }

    document.getElementById('textToType').innerHTML = displayText;
});

// Calculate WPM
function calculateWPM() {
    const timeElapsed = (new Date() - startTime) / 60000; // in minutes
    return (correctChars / 5) / timeElapsed;
}

// Calculate Accuracy
function calculateAccuracy() {
    return ((correctChars / totalChars) * 100).toFixed(2);
}

// Show final results (WPM and Accuracy)
function showResults() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    document.getElementById('wpm').innerText = `WPM: ${wpm.toFixed(2)}`;
    document.getElementById('accuracy').innerText = `Accuracy: ${accuracy}%`;
}

// Play keypress sounds
document.getElementById('inputBox').addEventListener('keydown', function () {
    const audio = new Audio('keypress.mp3'); // Replace with your sound file
    audio.play();
});

// Load text when the page loads
window.onload = loadText;
