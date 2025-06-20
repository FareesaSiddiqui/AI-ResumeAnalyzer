# 🧠 AI Resume Analyzer Tool

A smart web application where users can **upload their resume**, get a **resume score**, and receive **improvement suggestions** — all powered by a custom-built **MERN stack** system with **manual JWT token refresh using cookies** for secure authentication.

---

## 🚀 Features

- 📄 Upload your resume (PDF/DOC)
- 📊 Receive a resume score
- 💡 Get personalized suggestions to improve
- 🔐 JWT-based Auth with Refresh Token (cookie-based, manual implementation)
- 💻 Built with MERN Stack
- 🎨 Beautiful UI using Tailwind CSS

---

## 🛠 Tech Stack

| Layer         | Tech                               |
|---------------|------------------------------------|
| Frontend      | React + Tailwind CSS               |
| Backend       | Node.js + Express                  |
| Database      | MongoDB (with Mongoose)            |
| Auth          | JWT Access + Refresh Tokens (cookies) |
| File Upload   | Multer                             |

---

## 🔒 Authentication

This app uses **manual JWT token refresh flow**:
- Access token stored in `localStorage`
- Refresh token stored in `HttpOnly` cookie
- Custom `/refresh` route issues a new access token

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/resume-analyzer.git

# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup
cd frontend
npm install
npm run dev
