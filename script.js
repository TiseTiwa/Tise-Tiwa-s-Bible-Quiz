const questions = [
  {
    question: "How many books are in the Bible?",
    options: ["A. 66", "B. 27", "C. 39", "D. 50"],
    answer: 0,
    explanation:
      "There are 66 books in the Bible: 39 in the Old Testament and 27 in the New Testament.",
  },
  {
    question: "How many books are in the Old Testament?",
    options: ["A. 39", "B. 27", "C. 50", "D. 66"],
    answer: 0,
    explanation: "The Old Testament contains 39 books.",
  },
  {
    question: "How many books are in the New Testament?",
    options: ["A. 50", "B. 39", "C. 27", "D. 66"],
    answer: 2,
    explanation: "The New Testament contains 27 books.",
  },
  {
    question: "What is the longest chapter in the Bible?",
    options: [
      "A. Psalm 119",
      "B. Psalm 150",
      "C. Numbers 7",
      "D. Revelation 22",
    ],
    answer: 0,
    explanation: "Psalm 119 is the longest chapter in the Bible.",
  },
  {
    question: "How many Psalms are in the Book of Psalms?",
    options: ["A. 120", "B. 100", "C. 150", "D. 151"],
    answer: 2,
    explanation: "There are 150 Psalms in the Book of Psalms.",
  },
  {
    question:
      "Which New Testament book is not a Letter written by the Apostle Paul?",
    options: ["A. Galatians", "B. Ephesians", "C. Philemon", "D. Jude"],
    answer: 3,
    explanation: "Jude was not written by Paul.",
  },
  {
    question:
      "In what language was most of the Old Testament originally written?",
    options: ["A. Hebrew", "B. Aramaic", "C. Greek", "D. Latin"],
    answer: 0,
    explanation: "Most of the Old Testament was written in Hebrew.",
  },
  {
    question: "In what language was the New Testament originally written?",
    options: ["A. Hebrew", "B. Aramaic", "C. Greek", "D. Latin"],
    answer: 2,
    explanation: "The New Testament was written in Greek.",
  },
  // Add more questions as needed
];

let shuffledQuestions = [];
let current = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userName = "";
let highScore = localStorage.getItem("bibleQuizHighScore") || 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleOptions(options) {
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  const timerElem = document.getElementById("timer");
  timerElem.textContent = `Time left: ${timeLeft}s`;
  timerElem.classList.remove("text-red-600");

  // Progress
  document.getElementById("progressArea").textContent = `Question ${current + 1} of ${shuffledQuestions.length}`;

  // Do NOT shuffle options; keep A, B, C, D order
  const q = shuffledQuestions[current];
  const optionOrder = [0, 1, 2, 3];
  q._optionOrder = optionOrder;

  document.getElementById("questionArea").textContent = q.question;
  const optionsArea = document.getElementById("optionsArea");
  optionsArea.innerHTML = "";
  optionOrder.forEach((optIdx, btnIdx) => {
    const btn = document.createElement("button");
    btn.textContent = q.options[optIdx];
    btn.className =
      "block w-full text-left border rounded p-2 mb-2 hover:bg-blue-100 text-base";
    btn.setAttribute("aria-label", `Option ${String.fromCharCode(65 + btnIdx)}: ${q.options[optIdx].slice(3)}`);
    btn.tabIndex = 0;
    btn.onclick = () => selectOption(btnIdx);
    btn.onkeyup = (e) => {
      if (e.key === "Enter" || e.key === " ") btn.click();
    };
    optionsArea.appendChild(btn);
  });
  document.getElementById("nextBtn").classList.add("hidden");
  document.getElementById("resultArea").textContent = "";
  document.getElementById("summaryArea").textContent = "";

  timer = setInterval(() => {
    timeLeft--;
    timerElem.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 5 && timeLeft > 0) {
      timerElem.classList.add("text-red-600");
      // Play tick sound only for 5,4,3,2,1
      const tickSound = document.getElementById("tickSound");
      tickSound.currentTime = 0;
      tickSound.play();
    } else {
      timerElem.classList.remove("text-red-600");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      // Stop tick sound immediately (in case it is still playing)
      const tickSound = document.getElementById("tickSound");
      tickSound.pause();
      tickSound.currentTime = 0;
      selectOption(null, true); // Timeout
    }
  }, 1000);
}

function selectOption(btnIdx, isTimeout = false) {
  clearInterval(timer);
  const q = shuffledQuestions[current];
  const optionsArea = document.getElementById("optionsArea").children;
  const correctBtnIdx = q._optionOrder.findIndex((idx) => idx === q.answer);

  // Play sound
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  if (btnIdx === correctBtnIdx) {
    correctSound.currentTime = 0;
    correctSound.play();
  } else if (btnIdx !== null) {
    wrongSound.currentTime = 0;
    wrongSound.play();
  } else if (isTimeout) {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }

  for (let i = 0; i < optionsArea.length; i++) {
    optionsArea[i].disabled = true;
    if (i === correctBtnIdx) optionsArea[i].classList.add("bg-green-200");
    if (btnIdx !== null && i === btnIdx && i !== correctBtnIdx)
      optionsArea[i].classList.add("bg-red-200");
  }
  if (btnIdx === correctBtnIdx) score++;
  document.getElementById("resultArea").textContent = q.explanation;
  document.getElementById("nextBtn").classList.remove("hidden");
}

function nextQuestion() {
  current++;
  if (current < shuffledQuestions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  document.getElementById("questionArea").textContent = `Quiz Finished!`;
  document.getElementById("optionsArea").innerHTML = "";
  document.getElementById("timer").textContent = "";
  document.getElementById("nextBtn").classList.add("hidden");
  document.getElementById("progressArea").textContent = "";
  let message = `Well done${userName ? ", " + userName : ""}! Your score: ${score} / ${shuffledQuestions.length}.`;
  if (score > highScore) {
    localStorage.setItem("bibleQuizHighScore", score);
    highScore = score;
    message += " 🎉 New High Score!";
  } else {
    message += ` High Score: ${highScore}`;
  }
  document.getElementById("resultArea").textContent = message;
  document.getElementById("retryBtn").classList.remove("hidden");
  document.getElementById("shareBtn").classList.remove("hidden");

  // Show summary of correct answers
  let summary = "<div class='mt-2'><b>Quiz Summary:</b><ul class='list-disc pl-5'>";
  shuffledQuestions.forEach((q, idx) => {
    summary += `<li><b>Q${idx + 1}:</b> ${q.question}<br/><span class="text-green-700">Correct: ${q.options[q.answer]}</span><br/><span class="text-gray-500">${q.explanation}</span></li>`;
  });
  summary += "</ul></div>";
  document.getElementById("summaryArea").innerHTML = summary;
}

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Landing page logic
  const landingPage = document.getElementById("landingPage");
  const quizPage = document.getElementById("quizPage");
  const nameInput = document.getElementById("nameInput");
  const nameError = document.getElementById("nameError");
  const startQuizBtn = document.getElementById("startQuizBtn");
  const quizTitle = document.getElementById("quizTitle");

  startQuizBtn.onclick = () => {
    if (!nameInput.value.trim()) {
      nameInput.classList.add("border-red-600");
      nameError.classList.remove("hidden");
      return;
    }
    userName = nameInput.value.trim();
    quizTitle.textContent = `${userName}'s Bible Quiz`;
    landingPage.classList.add("hidden");
    quizPage.classList.remove("hidden");
    shuffledQuestions = [...questions];
    shuffle(shuffledQuestions);
    score = 0;
    current = 0;
    showQuestion();
    startQuizBtn.disabled = true;
    setTimeout(() => (startQuizBtn.disabled = false), 1000);

    // Mute tick sound for unlock
    const tickSound = document.getElementById("tickSound");
    tickSound.volume = 0; // Mute for unlock
    tickSound.play().then(() => {
      tickSound.pause();
      tickSound.currentTime = 0;
      tickSound.volume = 1; // Restore volume
    });
  };

  nameInput.oninput = () => {
    nameInput.classList.remove("border-red-600");
    nameError.classList.add("hidden");
  };

  document.getElementById("nextBtn").onclick = nextQuestion;
  document.getElementById("retryBtn").onclick = () => {
    score = 0;
    current = 0;
    shuffle(shuffledQuestions);
    document.getElementById("resultArea").textContent = "";
    document.getElementById("retryBtn").classList.add("hidden");
    document.getElementById("shareBtn").classList.add("hidden");
    document.getElementById("summaryArea").textContent = "";
    showQuestion();
  };

  document.getElementById("shareBtn").onclick = () => {
    const shareText = `${userName} scored ${score} out of ${shuffledQuestions.length} on Tise-Tiwa's Bible Quiz!`;
    if (navigator.share) {
      navigator
        .share({
          title: "Tise-Tiwa's Bible Quiz",
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText + " " + window.location.href);
      alert("Score copied! Share it with your friends.");
    }
  };
});
