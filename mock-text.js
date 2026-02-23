// mock-text.js
const questions = [
    "Tell me about yourself.",
    "Why do you want to work here?",
    "Describe a challenge you faced at work and how you dealt with it.",
    "What are your strengths and weaknesses?"
  ];
  
  let currentIndex = 0;
  
  const textQuestionEl = document.getElementById("textQuestion");
  const textAnswerEl = document.getElementById("textAnswer");
  const nextBtn = document.getElementById("nextTextBtn");
  
  function loadTextQuestion() {
    if (currentIndex < questions.length) {
      textQuestionEl.textContent = questions[currentIndex];
      textAnswerEl.value = '';
    } else {
      textQuestionEl.textContent = "🎉 You've completed the text mock interview!";
      textAnswerEl.style.display = "none";
      nextBtn.style.display = "none";
    }
  }
  
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    loadTextQuestion();
  });
  
  loadTextQuestion();
  