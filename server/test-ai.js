require('dotenv').config();
const { scoreResume } = require('./services/aiService');

const sampleResumeText = `
Kushagra Himdan
Skills: React, Node.js, MongoDB, Express, JavaScript
Projects: Built a full-stack e-commerce app using MERN stack.
Education: B.Tech Computer Science, 2026
`;

const sampleDrive = {
  role: 'Full Stack Developer',
  description: 'Looking for a developer skilled in React and Node.js to build web applications.',
};

scoreResume(sampleResumeText, sampleDrive)
  .then((result) => console.log('AI SCORING RESULT:', JSON.stringify(result, null, 2)))
  .catch((err) => console.error('AI SCORING ERROR:', err));