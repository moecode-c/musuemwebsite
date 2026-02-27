const quizData = [
  {
    tag: "Geography",
    question: "Which river was the lifeline of Ancient Egypt?",
    options: ["Nile River", "Tigris River", "Euphrates River", "Indus River"],
    answer: 0,
    explanation: "The Nile provided water, fertile soil, and transportation, making settlement and farming possible."
  },
  {
    tag: "Time Periods",
    question: "The Old Kingdom is best known for what achievement?",
    options: ["Building the Great Pyramids", "Creating papyrus", "Founding Alexandria", "Inventing glass"],
    answer: 0,
    explanation: "The Great Pyramids at Giza were built during the Old Kingdom as royal tombs."
  },
  {
    tag: "Writing",
    question: "What is the name of the ancient Egyptian writing system that uses symbols?",
    options: ["Cuneiform", "Hieroglyphs", "Latin", "Runes"],
    answer: 1,
    explanation: "Hieroglyphs combine pictorial and phonetic signs used on monuments and papyrus."
  },
  {
    tag: "Beliefs",
    question: "Which concept describes maintaining order and balance in Egyptian belief?",
    options: ["Karma", "Maat", "Nirvana", "Chaos"],
    answer: 1,
    explanation: "Maat represented truth, justice, and cosmic balance—central to Egyptian ethics."
  },
  {
    tag: "Religion",
    question: "Which god was associated with the underworld and mummification?",
    options: ["Ra", "Anubis", "Horus", "Aten"],
    answer: 1,
    explanation: "Anubis, depicted with a jackal head, guided embalming and protected tombs."
  },
  {
    tag: "Monuments",
    question: "What is the Great Sphinx carved from?",
    options: ["Limestone", "Granite", "Sandstone", "Basalt"],
    answer: 0,
    explanation: "The Great Sphinx at Giza is carved from limestone bedrock."
  },
  {
    tag: "Rulers",
    question: "Which title was used for Egypt's rulers?",
    options: ["Emperor", "Pharaoh", "Consul", "Shah"],
    answer: 1,
    explanation: "Pharaohs were considered divine kings and guardians of Maat."
  },
  {
    tag: "Daily Life",
    question: "What plant was used to make paper-like sheets in Ancient Egypt?",
    options: ["Papyrus", "Bamboo", "Reed Grass", "Flax"],
    answer: 0,
    explanation: "Papyrus stems were pressed into sheets used for writing and record-keeping."
  },
  {
    tag: "Architecture",
    question: "What was the primary purpose of pyramids?",
    options: ["Temples", "Royal tombs", "Granaries", "Markets"],
    answer: 1,
    explanation: "Pyramids served as monumental tombs to support the pharaoh in the afterlife."
  },
  {
    tag: "Trade",
    question: "Which region was famous for supplying gold to Ancient Egypt?",
    options: ["Nubia", "Crete", "Persia", "Gaul"],
    answer: 0,
    explanation: "Nubia, south of Egypt, was rich in gold and vital for trade and wealth."
  },
  {
    tag: "Science",
    question: "Why did Egyptians create a calendar based on the Nile?",
    options: ["To predict floods", "To plan wars", "To track eclipses", "To measure mountains"],
    answer: 0,
    explanation: "The Nile's annual flood (inundation) guided farming, so a calendar was essential."
  },
  {
    tag: "Culture",
    question: "Which material was commonly used for statues of officials and scribes?",
    options: ["Wood and limestone", "Plastic", "Marble", "Steel"],
    answer: 0,
    explanation: "Wood and limestone were readily available and used for sculpture and portraiture."
  },
  {
    tag: "Middle Kingdom",
    question: "What was a major focus of the Middle Kingdom?",
    options: ["Expanding trade and literature", "Building pyramids at Giza", "Founding Rome", "Colonizing Greece"],
    answer: 0,
    explanation: "The Middle Kingdom emphasized trade, literature, and administrative reforms."
  },
  {
    tag: "New Kingdom",
    question: "Which pharaoh is famous for the nearly intact tomb discovered in 1922?",
    options: ["Tutankhamun", "Khufu", "Djoser", "Sneferu"],
    answer: 0,
    explanation: "Tutankhamun's tomb was discovered by Howard Carter and revealed rich treasures."
  },
  {
    tag: "Legacy",
    question: "What is one lasting contribution of Ancient Egypt?",
    options: ["Early engineering and architecture", "Invention of electricity", "Printing press", "Steam engines"],
    answer: 0,
    explanation: "Egyptian engineering, geometry, and monumental architecture influenced later civilizations."
  }
];

const state = {
  currentIndex: 0,
  score: 0,
  answers: []
};

const quizCard = document.getElementById("quiz-card");
const quizBody = document.getElementById("quiz-body");
const quizProgress = document.getElementById("quiz-progress");
const quizScore = document.getElementById("quiz-score");
const startButton = document.getElementById("quiz-start");
const nextButton = document.getElementById("quiz-next");
const questionTemplate = document.getElementById("quiz-question-template");
const resultTemplate = document.getElementById("quiz-result-template");

// Read all labels from data attributes (set by EJS/i18n)
const L = {
  question:      quizCard?.dataset.labelQuestion      || "Question",
  of:            quizCard?.dataset.labelOf             || "of",
  score:         quizCard?.dataset.labelScore          || "Score",
  start:         quizCard?.dataset.labelStart          || "Start Quiz",
  next:          quizCard?.dataset.labelNext           || "Next",
  finish:        quizCard?.dataset.labelFinish         || "Finish",
  intro:         quizCard?.dataset.labelIntro          || "Start the quiz when you're ready. Try to answer based on what you know—then read the explanation to learn more about Egyptian history.",
  selectAnswer:  quizCard?.dataset.labelSelect         || "Select an answer to reveal the explanation.",
  correct:       quizCard?.dataset.labelCorrect        || "✅ Correct!",
  incorrect:     quizCard?.dataset.labelIncorrect      || "❌ Not quite.",
  resultTitle:   quizCard?.dataset.labelResultTitle    || "Great job!",
  scored:        quizCard?.dataset.labelScored         || "You scored",
  outOf:         quizCard?.dataset.labelOutOf          || "out of",
  msgExcellent:  quizCard?.dataset.labelMsgExcellent   || "Excellent! You have a strong foundation in Egyptian history.",
  msgGreat:      quizCard?.dataset.labelMsgGreat       || "Great effort! Review the notes below to deepen your knowledge.",
  msgNice:       quizCard?.dataset.labelMsgNice        || "Nice start! Read the explanations below and try again.",
  correctAnswer: quizCard?.dataset.labelCorrectAnswer  || "Correct answer:",
  restart:       quizCard?.dataset.labelRestart        || "Play Again",
};

const updateMeta = () => {
  if (!quizProgress || !quizScore) return;
  quizProgress.textContent = `${L.question} ${Math.min(state.currentIndex + 1, quizData.length)} ${L.of} ${quizData.length}`;
  quizScore.textContent = `${L.score}: ${state.score}`;
};

const resetQuiz = () => {
  state.currentIndex = 0;
  state.score = 0;
  state.answers = [];
  if (quizBody) {
    quizBody.innerHTML = `
      <p class="quiz-intro">${L.intro}</p>
      <button class="btn quiz-start" id="quiz-start" type="button">${L.start}</button>
    `;
  }
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.textContent = L.next;
  }
  attachStartHandler();
  updateMeta();
};

const renderQuestion = () => {
  if (!quizBody || !questionTemplate) return;
  const question = quizData[state.currentIndex];
  quizBody.innerHTML = "";
  const fragment = questionTemplate.content.cloneNode(true);
  const tagEl = fragment.querySelector("#quiz-tag");
  const questionEl = fragment.querySelector("#quiz-question-text");
  const optionsEl = fragment.querySelector("#quiz-options");
  const feedbackEl = fragment.querySelector("#quiz-feedback");

  if (tagEl) tagEl.textContent = question.tag;
  if (questionEl) questionEl.textContent = question.question;

  if (optionsEl) {
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => handleAnswer(index, button, optionsEl, feedbackEl));
      optionsEl.appendChild(button);
    });
  }

  if (feedbackEl) {
    feedbackEl.textContent = L.selectAnswer;
  }

  quizBody.appendChild(fragment);

  updateMeta();
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.textContent = state.currentIndex === quizData.length - 1 ? L.finish : L.next;
  }
};

const handleAnswer = (selectedIndex, selectedButton, optionsEl, feedbackEl) => {
  const question = quizData[state.currentIndex];
  const isCorrect = selectedIndex === question.answer;

  Array.from(optionsEl.children).forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === question.answer) {
      btn.classList.add("correct");
    } else if (idx === selectedIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    state.score += 1;
  }

  state.answers.push({
    question: question.question,
    correct: question.options[question.answer],
    selected: question.options[selectedIndex],
    explanation: question.explanation,
    isCorrect
  });

  if (feedbackEl) {
    feedbackEl.innerHTML = `${isCorrect ? L.correct : L.incorrect} ${question.explanation}`;
  }

  updateMeta();
  if (nextButton) {
    nextButton.disabled = false;
  }
};

const renderResults = () => {
  if (!quizBody || !resultTemplate) return;
  quizBody.innerHTML = "";
  const fragment = resultTemplate.content.cloneNode(true);
  const titleEl = fragment.querySelector("#quiz-result-title");
  const scoreEl = fragment.querySelector("#quiz-result-score");
  const messageEl = fragment.querySelector("#quiz-result-message");
  const summaryEl = fragment.querySelector("#quiz-summary");
  const restartButton = fragment.querySelector("#quiz-restart");

  if (titleEl) titleEl.textContent = L.resultTitle;

  if (scoreEl) {
    scoreEl.textContent = `${L.scored} ${state.score} ${L.outOf} ${quizData.length}.`;
  }

  if (messageEl) {
    if (state.score >= 12) {
      messageEl.textContent = L.msgExcellent;
    } else if (state.score >= 8) {
      messageEl.textContent = L.msgGreat;
    } else {
      messageEl.textContent = L.msgNice;
    }
  }

  if (summaryEl) {
    state.answers.forEach((answer, index) => {
      const item = document.createElement("div");
      item.className = "quiz-summary-item";
      item.innerHTML = `
        <strong>Q${index + 1}:</strong> ${answer.question}<br />
        <span>${L.correctAnswer} ${answer.correct}</span><br />
        <em>${answer.explanation}</em>
      `;
      summaryEl.appendChild(item);
    });
  }

  if (restartButton) {
    restartButton.textContent = L.restart;
    restartButton.addEventListener("click", resetQuiz);
  }

  quizBody.appendChild(fragment);
  if (nextButton) {
    nextButton.disabled = true;
  }
  updateMeta();
};

const handleNext = () => {
  if (state.currentIndex < quizData.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
  } else {
    renderResults();
  }
};

const attachStartHandler = () => {
  const freshStartButton = document.getElementById("quiz-start");
  if (freshStartButton) {
    freshStartButton.addEventListener("click", () => {
      renderQuestion();
    });
  }
};

if (startButton) {
  startButton.addEventListener("click", () => {
    renderQuestion();
  });
}

if (nextButton) {
  nextButton.addEventListener("click", handleNext);
}

updateMeta();
