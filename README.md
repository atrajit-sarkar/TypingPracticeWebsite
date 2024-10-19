Create a type practicing website with the following idea!

1. The website should be professionally designed
2. The website should be compatible with mobile vertical and horizontal view
3. It should fetch a Txt file from the GitHub repo with multiple Txt files. Also, the fetch will be random Txt files each time the website refreshes and it will display the content of the Txt file that the user has to write for typing practice. 
4. The website should detect typing and measure wpm and accuracy, and incorrect typing should be dynamically highlighted in red.
5. After the test, the website should show the final result as wpm and accuracy.
6. The website should also play key-pressing sounds and set a timer for 2 minutes when the user starts typing. After the timer ends, the website should show the above-mentioned results. 

Here's an outline for developing a professional typing practice website with the features you described:

### 1. **Design and Responsiveness**
   - **UI Design:** 
     - Clean and minimalistic design for a professional look.
     - Neutral color schemes (whites, grays, soft blues) for a distraction-free environment.
     - Typography focused on readability (e.g., Roboto, Open Sans).
     - Add subtle animations (e.g., keypress animations, progress bar during typing).
   
   - **Responsive Design:** 
     - Ensure compatibility for both mobile and desktop.
     - Use flexible grids (e.g., CSS Grid/Flexbox) and media queries for vertical and horizontal mobile views.
   
   - **Important Elements:**
     - A centered text box for displaying the fetched text.
     - A progress indicator or visual timer.
     - Input field for typing (or live area where the user’s text appears).
     - A results area that will show after the test ends (WPM, accuracy).

### 2. **Random Txt Fetching**
   - Use **GitHub API** to fetch files from a GitHub repository.
   - You can create multiple `.txt` files in the repo and write a function to randomly pick one file for each refresh.
   
   **Steps:**
   - Fetch the list of `.txt` files from the repository.
   - Use `Math.random()` or a similar method to pick one.
   - Display the content in the typing area.

   **Example JavaScript Code:**
   ```js
   async function fetchRandomFile() {
       const repoUrl = 'https://api.github.com/repos/{username}/{repo}/contents/{folder}';
       const response = await fetch(repoUrl);
       const files = await response.json();
       const txtFiles = files.filter(file => file.name.endsWith('.txt'));
       const randomFile = txtFiles[Math.floor(Math.random() * txtFiles.length)];
       const fileContent = await fetch(randomFile.download_url);
       return fileContent.text();
   }
   ```

### 3. **Typing Detection, WPM, and Accuracy**
   - Use JavaScript to capture the user's input and measure the **WPM (Words Per Minute)** and **accuracy**.
   - Track the correct and incorrect inputs in real time, highlighting incorrect characters in red.
   
   **Steps:**
   - Start tracking once the user starts typing.
   - Measure **WPM** using the formula: `WPM = (characters / 5) / minutes`.
   - Track **accuracy** by comparing the user's input to the fetched text. Highlight errors in real time.

   **Example JavaScript Code:**
   ```js
   let startTime;
   let totalChars = 0, correctChars = 0;
   
   document.getElementById('inputBox').addEventListener('input', function(e) {
       if (!startTime) startTime = new Date();
       const userInput = e.target.value;
       totalChars = userInput.length;
       correctChars = 0;

       for (let i = 0; i < userInput.length; i++) {
           if (userInput[i] === originalText[i]) {
               correctChars++;
               // Highlight correct characters (optional)
           } else {
               // Highlight incorrect characters in red
               e.target.style.color = 'red';
           }
       }
   });
   
   function calculateWPM() {
       const timeElapsed = (new Date() - startTime) / 60000; // in minutes
       return (correctChars / 5) / timeElapsed;
   }
   
   function calculateAccuracy() {
       return (correctChars / totalChars) * 100;
   }
   ```

### 4. **Keypress Sounds**
   - Use JavaScript’s `Audio` API to play a sound on each keypress.
   
   **Example Code:**
   ```js
   document.addEventListener('keydown', function() {
       const audio = new Audio('path_to_keypress_sound.mp3');
       audio.play();
   });
   ```

### 5. **Timer for 2 Minutes**
   - Set a countdown timer for 2 minutes, after which the typing test automatically ends, and results (WPM, accuracy) are displayed.
   
   **Example Code:**
   ```js
   let timeLimit = 120; // 2 minutes in seconds

   function startTimer() {
       const timer = setInterval(() => {
           timeLimit--;
           if (timeLimit === 0) {
               clearInterval(timer);
               // Show results here
               showResults();
           }
       }, 1000);
   }
   ```

### 6. **Displaying Final Results**
   - Once the timer ends or the user finishes typing, display the final **WPM** and **accuracy** in a results section.
   
   **Example Code:**
   ```js
   function showResults() {
       const wpm = calculateWPM();
       const accuracy = calculateAccuracy();
       document.getElementById('results').innerHTML = `
           <p>WPM: ${wpm.toFixed(2)}</p>
           <p>Accuracy: ${accuracy.toFixed(2)}%</p>
       `;
   }
   ```

### 7. **Tech Stack**
   - **Frontend:** HTML, CSS (Bootstrap for responsiveness), JavaScript
   - **Backend (Optional for Fetching Files):** GitHub API (or you can host static text files if no backend is needed)
   - **Hosting:** GitHub Pages or Netlify

### Next Steps:
1. Design the layout using HTML and CSS with mobile responsiveness in mind.
2. Implement the random text fetching and typing tracking with JavaScript.
3. Add keypress sounds and timer functionality.
4. Test across different devices (mobile and desktop) to ensure a smooth experience.

## Complete Source Code:

### 1. **HTML (index.html)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Typing Practice</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Typing Practice</h1>
        <div class="text-display">
            <p id="textToType"></p>
        </div>
        <textarea id="inputBox" placeholder="Start typing here..."></textarea>
        <div class="results">
            <p id="timer">Time: 2:00</p>
            <p id="wpm"></p>
            <p id="accuracy"></p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### 2. **CSS (styles.css)**

```css
body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    text-align: center;
    width: 100%;
    max-width: 600px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.text-display {
    margin: 20px 0;
    padding: 15px;
    background: #e9e9e9;
    border-radius: 8px;
    font-size: 18px;
    min-height: 100px;
}

textarea {
    width: 100%;
    padding: 10px;
    font-size: 18px;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
    resize: none;
    min-height: 100px;
}

textarea:focus {
    border-color: #6a5acd;
}

.results {
    margin-top: 20px;
}

#timer, #wpm, #accuracy {
    font-size: 20px;
    margin: 10px 0;
}

.incorrect {
    color: red;
}
```

### 3. **JavaScript (script.js)**

```javascript
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
```

### 4. **How to Use**

1. **GitHub Repository:**
   - Create a GitHub repository with a folder containing multiple `.txt` files. Replace `{username}`, `{repo}`, and `{folder}` in the code with your GitHub repository details.

2. **Keypress Sound:**
   - Add a sound file (`keypress.mp3`) in the same directory as the HTML file. You can download a keypress sound or record one.

3. **Hosting:**
   - You can host this website on GitHub Pages, Netlify, or any static site hosting platform. Just upload the `index.html`, `styles.css`, `script.js`, and any additional assets (like sound files) to the platform.

4. **Testing:**
   - Open `index.html` in a browser and ensure that the text files are fetched correctly, typing is detected, and results are shown after 2 minutes or after the user completes typing.

Let me know if you need any further customization or explanation!