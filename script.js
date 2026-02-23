let allQuestions = {};
let currentCategory = 'HR';
let userAnswers = {};
const listElement = document.getElementById('question-list');

function switchCategory(category) {
  currentCategory = category;
  displayQuestions(category);
}

function displayQuestions(category) {
  listElement.innerHTML = '';
  allQuestions[category].forEach((q, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <h3>${index + 1}. ${q.question}</h3>
      <textarea
        placeholder="Write your answer here..."
        oninput="handleUserInput('${category}', ${index}, this.value)"
      ></textarea>
      <div style="margin-top:8px;">
        <button class="sample-toggle hidden" onclick="toggleSample(this)">💡 Show Sample Answer</button>
        <button class="feedback-toggle hidden" onclick="generateFeedback(this, '${category}', ${index})">🔍 Get Feedback</button>
      </div>
      <div class="answer-box hidden">${q.answer}</div>
      <div class="feedback-box hidden"></div>
    `;

    listElement.appendChild(li);
  });
}

function handleUserInput(category, index, value) {
  const key = `${category}-${index}`;
  userAnswers[key] = value;

updateProgressTracker();

  const parent = event.target.parentElement;
  const toggleButton = parent.querySelector('.sample-toggle');
  const feedbackButton = parent.querySelector('.feedback-toggle');

  if (value.trim() !== '') {
    toggleButton.classList.remove('hidden');
    feedbackButton.classList.remove('hidden');
  } else {
    toggleButton.classList.add('hidden');
    feedbackButton.classList.add('hidden');
  }
}

function toggleSample(btn) {
  const box = btn.parentElement.nextElementSibling;
  box.classList.toggle('hidden');
  btn.textContent = box.classList.contains('hidden') ? '💡 Show Sample Answer' : '🙈 Hide Sample Answer';
}

function generateFeedback(btn, category, index) {
  const li = btn.closest('li');
  const feedbackBox = li.querySelector('.feedback-box');
  const textarea = li.querySelector('textarea');
  const answer = textarea.value.trim();
  const question = allQuestions[category][index].question;

  feedbackBox.classList.remove('hidden');
  feedbackBox.textContent = '⏳ Analysing your answer...';

  setTimeout(() => {
    feedbackBox.textContent = smartFeedback(answer, question, category);
  }, 600);
}

function smartFeedback(answer, question, category) {
  if (!answer || answer.length < 20) {
    return '⚠️ Your answer is too short. Try to give a complete, thoughtful response with at least 2-3 sentences.';
  }

  const wordCount = answer.split(/\s+/).length;
  const lowerAnswer = answer.toLowerCase();
  const tips = [];
  let score = 0;

  // Length scoring
  if (wordCount >= 60) score += 25;
  else if (wordCount >= 35) score += 15;
  else score += 5;

  // Check for specific examples
  const hasExample = ['for example','for instance','such as','i once','when i','in my','during'].some(phrase => lowerAnswer.includes(phrase));
  if (hasExample) { score += 20; }
  else { tips.push('💡 Add a specific example or personal story — this makes your answer much more memorable.'); }

  // Category-specific checks
  if (category === 'Behavioral') {
    const hasSituation = ['situation','challenge','project','team','time when'].some(w => lowerAnswer.includes(w));
    const hasAction = ['i decided','i did','i took','i implemented','i led','i helped','i worked','i built'].some(w => lowerAnswer.includes(w));
    const hasResult = ['result','outcome','learned','achieved','success','improved','completed'].some(w => lowerAnswer.includes(w));

    if (hasSituation) score += 12;
    else tips.push('📌 Describe the Situation clearly — use the STAR method: Situation → Task → Action → Result.');

    if (hasAction) score += 12;
    else tips.push('⚡ Be specific about the Action YOU took. Use "I" instead of "we".');

    if (hasResult) score += 12;
    else tips.push('🏆 Always include the Result or what you learned. Numbers/metrics make it even stronger.');
  }

  if (category === 'Technical') {
    const hasDepth = ['because','which means','this allows','this ensures','this works by','used to'].some(w => lowerAnswer.includes(w));
    if (wordCount >= 40) score += 15;
    if (hasDepth) { score += 10; }
    else { tips.push('🔬 Go deeper — explain WHY or HOW something works, not just what it is.'); }
  }

  if (category === 'HR') {
    const isConnectedToJob = ['company','role','team','career','opportunity','grow','contribute'].some(w => lowerAnswer.includes(w));
    score += 10;
    if (isConnectedToJob) { score += 10; }
    else { tips.push('🔗 Try to connect your answer to the role or company — show relevance to the interviewer.'); }
  }

  // Filler phrases check
  const fillers = ['i am a hardworking','i am a team player','i am very passionate'];
  if (fillers.some(f => lowerAnswer.includes(f))) {
    tips.push('❌ Avoid cliché phrases like "hardworking" or "team player" — demonstrate these qualities with real examples instead.');
  } else {
    score += 5;
  }

  score = Math.min(score, 100);

  const emoji = score >= 75 ? '🌟' : score >= 50 ? '👍' : '📝';
  const label = score >= 75 ? 'Great answer!' : score >= 50 ? 'Good start — a few improvements needed.' : 'Needs more development.';

  let feedback = `${emoji} Score: ${score}/100 — ${label}\n`;
  feedback += `📏 Word count: ${wordCount} word${wordCount !== 1 ? 's' : ''}`;
  feedback += wordCount < 40 ? ' (aim for 50+ words)\n' : ' ✅\n';

  if (tips.length > 0) {
    feedback += '\n📋 Suggestions:\n' + tips.join('\n');
  } else {
    feedback += '\n✅ Well structured! Be ready for follow-up questions on this topic.';
  }

  return feedback;
}

function downloadAnswers() {
  let content = `MY INTERVIEW ANSWERS\nGenerated: ${new Date().toLocaleDateString()}\n${'='.repeat(40)}\n\n`;
  let hasContent = false;

  Object.keys(userAnswers).forEach(key => {
    const [cat, idx] = key.split('-');
    const q = allQuestions[cat][parseInt(idx)];
    if (q && userAnswers[key].trim()) {
      content += `[${cat}] Q: ${q.question}\nMy Answer: ${userAnswers[key]}\n\n`;
      hasContent = true;
    }
  });

  if (!hasContent) {
    alert('No answers to download yet! Write some answers first.');
    return;
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'my-interview-answers.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.onclick = () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};

// Side shelf
function toggleShelf() {
  const shelf = document.getElementById('sideShelf');
  if (shelf) shelf.classList.toggle('active');
}

// Resume review — FIXED: real analysis instead of hardcoded text
function reviewResume() {
  const input = document.getElementById('resumeInput').value.trim();
  const feedbackBox = document.getElementById('resumeFeedback');

  if (!input) {
    feedbackBox.innerHTML = '<p>⚠️ Please paste your resume content first.</p>';
    feedbackBox.classList.remove('hidden');
    return;
  }

  const lower = input.toLowerCase();
  const wordCount = input.split(/\s+/).length;
  const issues = [];
  const good = [];
  let score = 0;

  if (wordCount > 200) { score += 15; good.push('✅ Good content length.'); }
  else { issues.push('⚠️ Resume seems short — make sure you pasted the complete content.'); }

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(input);
  const hasPhone = /(\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4}|\+\d{1,3}[\s-]\d+)/i.test(input);
  if (hasEmail) { score += 10; good.push('✅ Email address found.'); }
  else { issues.push('❌ No email found — your contact info must be clearly listed.'); }
  if (hasPhone) { score += 5; good.push('✅ Phone number found.'); }
  else { issues.push('⚠️ No phone number detected — add your contact number.'); }

  if (lower.includes('education')) { score += 10; good.push('✅ Education section present.'); }
  else { issues.push('❌ No Education section found.'); }

  if (['experience','internship','work history'].some(w => lower.includes(w))) {
    score += 15; good.push('✅ Experience/Internship section found.');
  } else { issues.push('❌ No Experience section found — add internships, part-time, or freelance work.'); }

  if (['skills','technologies','tools'].some(w => lower.includes(w))) {
    score += 10; good.push('✅ Skills section found.');
  } else { issues.push('❌ No Skills section — list technical and relevant soft skills.'); }

  if (['project','projects','portfolio'].some(w => lower.includes(w))) {
    score += 10; good.push('✅ Projects section found — great for freshers!');
  } else { issues.push('💡 Add a Projects section — especially important if you have limited work experience.'); }

  const actionVerbs = ['developed','built','designed','implemented','led','created','managed','improved','achieved','delivered','launched','automated'];
  const foundVerbs = actionVerbs.filter(v => lower.includes(v));
  if (foundVerbs.length >= 3) { score += 15; good.push(`✅ Strong action verbs used (${foundVerbs.slice(0,3).join(', ')}...).`); }
  else { issues.push('💡 Use more strong action verbs: developed, built, led, implemented, achieved...'); }

  const hasNumbers = /\d+%|\d+\s*(users|projects|members|clients|months|years|students|hours|times)/i.test(input);
  if (hasNumbers) { score += 10; good.push('✅ Quantified achievements found — very effective!'); }
  else { issues.push('💡 Quantify your impact: "Reduced load time by 40%", "Led team of 5", "Served 200+ users".'); }

  const fillers = ['hardworking','team player','go-getter','passionate individual','detail oriented'];
  const foundFillers = fillers.filter(f => lower.includes(f));
  if (foundFillers.length > 0) {
    issues.push(`❌ Remove cliché phrases like "${foundFillers[0]}" — show these traits through real accomplishments.`);
  } else { score += 5; good.push('✅ No overused buzzwords detected.'); }

  score = Math.min(score, 100);
  const label = score >= 75 ? '🌟 Strong Resume' : score >= 50 ? '👍 Good — Can Be Improved' : '📝 Needs Significant Improvement';
  const barColor = score >= 75 ? '#2ecc71' : score >= 50 ? '#f39c12' : '#e74c3c';

  feedbackBox.innerHTML = `
    <div style="margin-bottom:12px;">
      <span style="font-size:2rem;font-weight:700;color:#2575fc;">${score}/100</span>
      <span style="margin-left:12px;font-size:1rem;font-weight:600;">${label}</span>
    </div>
    <div style="background:#e0e0e0;border-radius:20px;height:12px;margin-bottom:18px;overflow:hidden;">
      <div style="width:${score}%;height:100%;border-radius:20px;background:${barColor};transition:width 1s ease;"></div>
    </div>
    ${good.length ? `<div style="margin-bottom:14px;"><strong>✅ What's Good</strong><ul style="margin-top:6px;padding-left:18px;">${good.map(g=>`<li style="margin:5px 0;font-size:0.9rem;">${g}</li>`).join('')}</ul></div>` : ''}
    ${issues.length ? `<div><strong>🔧 Improvements Needed</strong><ul style="margin-top:6px;padding-left:18px;">${issues.map(i=>`<li style="margin:5px 0;font-size:0.9rem;">${i}</li>`).join('')}</ul></div>` : ''}
  `;
  feedbackBox.classList.remove('hidden');
}

// Fetch questions
fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    allQuestions = data;
    if (listElement) { displayQuestions(currentCategory); updateProgressTracker(); }
  })
  .catch(err => console.warn('Could not load questions.json:', err));

  // ── PROGRESS TRACKER ──
function updateProgressTracker() {
  const container = document.getElementById('trackerCategories');
  if (!container || Object.keys(allQuestions).length === 0) return;

  container.innerHTML = '';

  Object.keys(allQuestions).forEach(cat => {
    const total = allQuestions[cat].length;
    const answered = allQuestions[cat].reduce((count, _, i) => {
      const key = `${cat}-${i}`;
      return count + (userAnswers[key] && userAnswers[key].trim().length > 10 ? 1 : 0);
    }, 0);

    const pct = Math.round((answered / total) * 100);
    const color = pct === 100 ? '#2ecc71' : pct >= 50 ? '#f39c12' : '#2575fc';

    const div = document.createElement('div');
    div.style.cssText = 'flex:1; min-width:140px;';
    div.innerHTML = `
      <div style="font-size:0.85rem; font-weight:600; margin-bottom:4px;">${cat}</div>
      <div style="font-size:0.8rem; color:#888; margin-bottom:6px;">${answered}/${total} answered</div>
      <div style="background:#e0e0e0; border-radius:20px; height:8px; overflow:hidden;">
        <div style="width:${pct}%; height:100%; border-radius:20px; background:${color}; transition: width 0.6s ease;"></div>
      </div>
    `;
    container.appendChild(div);
  });
}

function resetProgress() {
  if (!confirm('Reset all your answers? This cannot be undone.')) return;
  userAnswers = {};
  displayQuestions(currentCategory);
  updateProgressTracker();
}
