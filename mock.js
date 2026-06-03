const questions = [
  { text: "Tell me about yourself.", time: 120 },
  { text: "Why should we hire you?", time: 90 },
  { text: "Describe a challenging situation and how you handled it.", time: 120 },
  { text: "What are your strengths and weaknesses?", time: 90 },
  { text: "Where do you see yourself in 5 years?", time: 90 }
];

let currentIndex = 0;
let timerInterval = null;
let timeLeft = 0;
let sessionLog = []; // tracks each question result

const questionEl = document.getElementById('question');
const questionCounter = document.getElementById('questionCounter');
const progressBar = document.getElementById('progressBar');
const videoPreview = document.getElementById('videoPreview');
const recordedVideo = document.getElementById('recordedVideo');
const recordedLabel = document.getElementById('recordedLabel');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadLink = document.getElementById('downloadLink');
const nextBtn = document.getElementById('nextBtn');
const timerEl = document.getElementById('timer');
const summaryEl = document.getElementById('summary');
const summaryList = document.getElementById('summaryList');

let mediaRecorder;
let recordedChunks = [];
let recordingStartTime = null;

function loadQuestion() {
  if (currentIndex >= questions.length) {
    showSummary();
    return;
  }

  const q = questions[currentIndex];
  questionEl.textContent = q.text;
  questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  // Reset UI
  recordedVideo.classList.add('hidden');
  recordedLabel.classList.add('hidden');
  downloadLink.classList.add('hidden');
  startBtn.disabled = false;
  stopBtn.disabled = true;

  resetTimer(q.time);
}

function resetTimer(seconds) {
  clearInterval(timerInterval);
  timeLeft = seconds;
  timerEl.classList.remove('warning');
  updateTimerDisplay();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 15) timerEl.classList.add('warning');
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Auto-stop recording if still going
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Webcam init
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    videoPreview.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const duration = recordingStartTime ? Math.round((Date.now() - recordingStartTime) / 1000) : 0;

      // Log this question's result
      sessionLog.push({
        question: questions[currentIndex].text,
        duration: duration,
        maxTime: questions[currentIndex].time
      });

      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      recordedVideo.src = videoURL;
      recordedVideo.classList.remove('hidden');
      recordedLabel.classList.remove('hidden');
      downloadLink.href = videoURL;
      downloadLink.classList.remove('hidden');
    };
  })
  .catch(err => alert('Could not access camera/mic: ' + err));

startBtn.onclick = () => {
  recordedChunks = [];
  recordingStartTime = Date.now();
  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  startTimer();
};

stopBtn.onclick = () => {
  clearInterval(timerInterval);
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
};

nextBtn.onclick = () => {
  clearInterval(timerInterval);
  // If still recording, stop it first and log
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  } else if (sessionLog.length <= currentIndex) {
    // Skipped without recording
    sessionLog.push({
      question: questions[currentIndex].text,
      duration: 0,
      maxTime: questions[currentIndex].time,
      skipped: true
    });
  }
  currentIndex++;
  loadQuestion();
};

function showSummary() {
  // Hide interview UI
  document.getElementById('question').classList.add('hidden');
  document.getElementById('timer').classList.add('hidden');
  questionCounter.classList.add('hidden');
  videoPreview.classList.add('hidden');
  startBtn.classList.add('hidden');
  stopBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  recordedVideo.classList.add('hidden');
  recordedLabel.classList.add('hidden');
  downloadLink.classList.add('hidden');

  // Build summary
  summaryList.innerHTML = '';
  sessionLog.forEach((entry, i) => {
    const li = document.createElement('li');
    let status = '';
    if (entry.skipped) {
      status = '⏭ Skipped';
    } else if (entry.duration >= entry.maxTime * 0.7) {
      status = `✅ Good (${entry.duration}s recorded)`;
    } else if (entry.duration > 0) {
      status = `⚠️ Short answer (${entry.duration}s — aim for ${Math.round(entry.maxTime * 0.7)}s+)`;
    } else {
      status = '❌ Not recorded';
    }
    li.innerHTML = `<strong>Q${i + 1}:</strong> ${entry.question}<br><span style="color:#555;font-size:0.88rem;">${status}</span>`;
    li.style.marginBottom = '10px';
    summaryList.appendChild(li);
  });

  summaryEl.style.display = 'block';
  progressBar.style.width = '100%';
}

function restartInterview() {
  currentIndex = 0;
  sessionLog = [];
  summaryEl.style.display = 'none';

  // Restore hidden elements
  ['question','timer','videoPreview','startBtn','stopBtn','nextBtn'].forEach(id => {
    document.getElementById(id).classList.remove('hidden');
  });
  questionCounter.classList.remove('hidden');

  loadQuestion();
}

loadQuestion();