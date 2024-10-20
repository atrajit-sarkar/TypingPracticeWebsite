let originalText = '';
let startTime, timerInterval;
let totalChars = 0, correctChars = 0, incorrectChars = 0;
let timeLimit // 2 minutes
const dynamic_result = document.querySelector(".dynamic-result")

// Fetch a random text file from the GitHub repo
async function fetchRandomFile() {
    const repoUrl = 'https://api.github.com/repos/atrajit-sarkar/TypingPracticeWebsite/contents/PracticeFiles';

    try {
        const response = await fetch(repoUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const files = await response.json();
        const txtFiles = files.filter(file => file.name.endsWith('.txt'));

        if (txtFiles.length === 0) {
            throw new Error("No .txt files found in the folder");
        }

        const randomFile = txtFiles[Math.floor(Math.random() * txtFiles.length)];
        const fileContentResponse = await fetch(randomFile.download_url);

        if (!fileContentResponse.ok) {
            throw new Error(`Failed to fetch file content: ${fileContentResponse.statusText}`);
        }

        return fileContentResponse.text();

    } catch (error) {
        console.error("Error fetching text file: ", error);
        return "Error fetching text file.";
    }
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
    document.getElementById('timer').addEventListener('submit', function (event) {
        // Prevent form from actually submitting to a server
        event.preventDefault();

        // Get the selected value
        var selectedTime = document.getElementById('colors');
        // Get the selected option
        var selectedOption = selectedTime.options[selectedTime.selectedIndex];

        // Get the inner text of the selected option
        var selectedText = selectedOption.text;

        // Display the selected value
        document.getElementById('timer').innerHTML=`Time: ${selectedText}`;
        timeLimit=parseInt(selectedTime.value)
    });
}

// Start the typing timer and test
function startTypingTest() {
    if (!document.querySelector(".wpm")) {

        const wpm_div = document.createElement("div")
        wpm_div.setAttribute("class", "wpm")
        dynamic_result.append(wpm_div)
    }

    if (!document.querySelector(".accuracy")) {

        const accuracy_div = document.createElement("div")
        accuracy_div.setAttribute("class", "accuracy")
        dynamic_result.append(accuracy_div)
    }

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
    let completed = true;


    for (let i = 0; i < originalText.length; i++) {
        if (userInput[i] === originalText[i]) {
            displayText += `<span class="correct">${originalText[i]}</span>`;
            correctChars++;
        } else if (userInput[i]) {
            displayText += `<span class="incorrect">${originalText[i]}</span>`;
            incorrectChars++;
            completed = false;  // Mark as incomplete if any incorrect characters
        } else {
            displayText += `<span class="faded">${originalText[i]}</span>`;
            completed = false;  // Mark as incomplete if there are remaining characters
        }
    }

    document.getElementById('textToType').innerHTML = displayText;
    // Display dynamic WPM and Accuracy
    const wpm = document.querySelector(".wpm")
    const accuracy = document.querySelector(".accuracy")
    wpm.innerHTML = `WPM: ${calculateWPM().toFixed(2)}`
    accuracy.innerHTML = `Accuracy: ${calculateAccuracy()}`

    // If the user has finished typing correctly, stop the timer and show results
    if (completed && userInput.length === originalText.length) {
        clearInterval(timerInterval);
        document.getElementById('timer').remove()
        showResults();
    }
});

//Submit button functionality:
document.querySelector("#submit").addEventListener("click", () => {
    clearInterval(timerInterval);
    document.getElementById('timer').remove()
    showResults();
})

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
    document.querySelector("#inputBox").remove()
    document.querySelector("#submit").remove()
    dynamic_result.innerHTML=`<h2>Stop Writing</h2>`
}

// Play keypress sounds
document.getElementById('inputBox').addEventListener('keydown', function () {
    const audio = new Audio('keypress1.mp3'); // Replace with your sound file
    audio.play();
});

// Load text when the page loads
window.onload = loadText;
