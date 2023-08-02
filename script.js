let vocabularyData = []; // Array to hold vocabulary data from the CSV file
let wordsToPractice = 0;
let currentIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// Load CSV data and start the game
dataToLoad = parseInt(prompt("Choose topic to practice:\n   1. General\n   2. Gender\n   3. Animals\n   4. House\n   5. Connectors"));
dataBase = '';
dataBasePath = 'dataBases/';
switch (dataToLoad) {
    case 1:
      dataBase = '01_General.csv';
      break;
    case 2:
      dataBase = '02_Gender.csv';
      break;
    case 3:
      dataBase = '03_Animals.csv';
      break;
    case 4:
      dataBase = '04_House.csv';
      break;
    case 5:
      dataBase = '05_Connectors.csv';
      break;
    default:
      alert("Invalid input")
  }
  fetch(dataBasePath + dataBase)
  .then(response => response.text())
  .then(data => {
    vocabularyData = parseCSV(data);
    startGame();
  })
  .catch(error => console.error('Error loading CSV file:', error));

// Function to parse the CSV data into an array of [german,foreign] pairs
function parseCSV(csvData) {
  const lines = csvData.trim().split('\n');
  return lines.map(line => line.split(','));
}

// Function to start the game
function startGame() {
  wordsToPractice = parseInt(prompt("How many words do you want to practice?")) || 0;
  if (wordsToPractice <= 0 || wordsToPractice > vocabularyData.length) {
    alert("Invalid input. Please enter a number between 1 and " + vocabularyData.length);
    return;
  }
  showNextQuestion();
}

// Function to display the next question and options
function showNextQuestion() {
    if (currentIndex >= wordsToPractice) {
      displayResult();
      return;
    }
  
    const [germanWord, foreignWord] = vocabularyData[currentIndex];
    const options = getRandomOptions(foreignWord);
  
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
  
    questionElement.textContent = `What is it means "${germanWord}"?:`;
  
    optionsElement.innerHTML = '';
    options.forEach(option => {
      const optionElement = document.createElement('button');
      optionElement.textContent = option;
      optionElement.onclick = () => checkAnswer(option === foreignWord);
      
      // Add a line break after each option
      const lineBreak = document.createElement('br');     
      optionsElement.appendChild(optionElement);
      optionsElement.appendChild(lineBreak);
    });
  }
 
// Function to get random options for the multiple-choice question
function getRandomOptions(correctOption) {
  const allOptions = vocabularyData.map(pair => pair[1]);
  const shuffledOptions = shuffleArray(allOptions.filter(option => option !== correctOption));
  const randomOptions = shuffledOptions.slice(0, 3);
  randomOptions.push(correctOption);
  return shuffleArray(randomOptions);
}

// Function to shuffle an array randomly
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Function to check the user's answer
function checkAnswer(isCorrect) {
  if (isCorrect) {
    correctAnswers++;
  } else {
    incorrectAnswers++;
  }
  currentIndex++;
  showNextQuestion();
}

// Function to display the final result
function displayResult() {
  const totalQuestions = correctAnswers + incorrectAnswers;
  const ratio = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `
    <h2>Result:</h2>
    <p>Good Answers: ${correctAnswers}</p>
    <p>Bad Answers: ${incorrectAnswers}</p>
    <p>Remaining: ${wordsToPractice - totalQuestions}</p>
    <p>Ratio: ${Math.round(ratio * 100)}%</p>
  `;
}
