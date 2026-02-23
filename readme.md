# 🎯 Interview Prep Platform

A fully frontend web application to help students and job seekers practice for interviews — with text-based Q&A, AV mock interviews, a resume reviewer, and an AI chatbot.



---

## ✨ Features

- **📝 Text Mock Interview** — Answer HR, Technical, Behavioral, DSA, and System Design questions and get instant scored feedback
- **🎤 AV Mock Interview** — Record yourself answering questions on camera with a countdown timer and end-of-session summary
- **💬 AI Interview Chatbot** — Get guidance on common interview topics like STAR method, salary negotiation, handling weaknesses, and more
- **📄 Resume Reviewer** — Paste your resume and get a scored analysis with specific improvement suggestions
- **🌙 Dark Mode** — Full dark mode support across all pages
- **📊 Progress Tracker** — Track how many questions you've answered in each category
- **📥 Download Answers** — Export all your written answers as a .txt file
- **☰ Resource Shelf** — Quick links to LeetCode, GeeksforGeeks, LinkedIn, and more

---

## 🗂 Project Structure
```
interview-prep/
│
├── index.html          # Home page with question practice + progress tracker
├── chatbot.html        # AI Interview Chatbot
├── mock.html           # AV (camera + mic) Mock Interview
├── mock-text.html      # Text-based Mock Interview
├── resume.html         # Resume Review tool
│
├── script.js           # Main JS — questions, feedback, resume review, progress
├── mock.js             # AV mock interview logic (timer, recording, summary)
│
├── style.css           # Unified stylesheet for all pages
├── questions.json      # All interview Q&A data (HR, Technical, Behavioral, DSA, System Design)
│
└── assets/             # Icons and images
```

---

## 🚀 Getting Started (Run Locally)

No installation needed. This is a pure HTML/CSS/JS project.

1. Clone the repository:
```bash
   git clone https://github.com/YOUR_USERNAME/interview-prep.git
```
2. Open the project folder
3. Open `index.html` in your browser

> **Note:** The app fetches `questions.json` via `fetch()`, so you need a local server if your browser blocks local file requests.
> The easiest way: use the **Live Server** extension in VS Code — right click `index.html` → *Open with Live Server*.


---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling, animations, dark mode |
| Vanilla JavaScript | All logic and interactivity |
| MediaRecorder API | Camera/mic recording |
| Fetch API | Loading questions from JSON |
| LocalStorage | Dark mode preference persistence |



## 🙋‍♂️ Author

**Your Name**
- GitHub: [Shirish-Patel-03](https://github.com/Shirish-Patel-03)
- LinkedIn: [Shirish Patel](https://linkedin.com/in/shirish-patel-a3a70b292)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
```

---