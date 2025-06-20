const router = require('express').Router()
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


router.post('/analyze',verifyToken, upload.any(), async (req, res) => {
    console.log("🧾 Incoming headers:", req.headers);

    try {
        const jobDescription = req.body.jobDescription;
        const resumeFile = req.files?.[0];

        if (!jobDescription || !resumeFile) {
            return res.status(400).json({ error: 'Job description or resume file not provided' });
        }

        console.log("Received body:", req.body);
        console.log("Received files:", req.files);

        // Parse resume PDF
        const resumeBuffer = await fs.promises.readFile(resumeFile.path);
        const pdfData = await pdfParse(resumeBuffer);
        const resumeText = pdfData.text;

        // ---------- MATCHING SKILLS LOGIC HERE ----------
    // ---------- Skill Matching Logic ----------
const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'in',
  'is', 'it', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'with', 'we', 'you', 'looking', 'developer', 'mern', 'stack', 'expertise'
]);

const techSkills = [
  'html', 'css', 'javascript', 'react', 'node.js', 'express', 'mongodb',
  'mysql', 'php', 'bootstrap', 'python', 'java', 'git', 'github',
  'api', 'rest', 'docker', 'typescript', 'redux'
];


const extractSkills = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w.+#]/g, ' ') // Keep tech terms like node.js, c++
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

const jobWords = extractSkills(jobDescription);
const resumeWords = extractSkills(resumeText);

const resumeSet = new Set(resumeWords);
const matchedSkills = [];
const missingSkills = [];

techSkills.forEach(skill => {
  const skillLower = skill.toLowerCase();
  const inResume = resumeWords.includes(skillLower);
  const inJob = jobWords.includes(skillLower);

  if (inJob && inResume) {
    matchedSkills.push(skill);
  } else if (inJob && !inResume) {
    missingSkills.push(skill);
  }
});


        // -------------------------------------------------

        // Gemini Analysis
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: 'be short and concise',
        });

        const generationConfig = {
            temperature: 0.2,
            topP: 0.95,
            topK: 64,
            responseMimeType: 'text/plain'
        };

        const prompt = `
I will give you a resume and job description. Compare the resume against the job description and 
provide the following:

1. A single number score out of 10.
2. Good points (in a single line).
3. Missing points (in a single line).
4. Possible improvements (in a single line).

Resume: ${resumeText}
Job Description: ${jobDescription}

Return each point on a new line. Be concise.
`;

        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig
        });

        const response = await result.response;

        // Delete the uploaded resume file after use
        fs.unlink(resumeFile.path, (err) => {
            if (err) console.error('Failed to delete file:', err);
        });

        // 👇 Send response including analysis + skill match info
        res.json({
            analysis: response.text(),
            matchedSkills: matchedSkills,
            missingSkills: missingSkills
        });

    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/ping', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid ✅', user: req.user });
});


module.exports = router