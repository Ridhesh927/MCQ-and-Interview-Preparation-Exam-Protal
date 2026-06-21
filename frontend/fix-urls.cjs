const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/auth/Login.tsx',
  'src/pages/student/AvailableExams.tsx',
  'src/pages/student/InterviewPrepHub.tsx',
  'src/pages/student/Settings.tsx',
  'src/pages/student/StudentDashboard.tsx',
  'src/pages/student/StudentResults.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  let content = fs.readFileSync(filePath, 'utf8');
  // replace 'http://localhost:5000/api... with `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api...`
  // The string is matched starting from 'http://localhost:5000
  content = content.replace(/'http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_BASE_URL || \'http://localhost:5000\'}');
  
  // WAIT, the end of the string has a single quote `'` in the original code, e.g. 'http://localhost:5000/api/auth/student/login'
  // So replacing the start with a backtick ` means we need to replace the ending quote with a backtick as well!
  // It's better to use regex to capture the whole URL.
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_BASE_URL || \'http://localhost:5000\'}$1`');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${f}`);
});
