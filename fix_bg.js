const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Tasks.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace background: 'none' with backgroundColor: 'transparent'
content = content.replace(/background:\s*'none'/g, "backgroundColor: 'transparent'");

// Replace background: '#FFFFFF' with backgroundColor: '#FFFFFF'
content = content.replace(/background:\s*'#FFFFFF'/g, "backgroundColor: '#FFFFFF'");

// Replace background: 'var(--color-danger)' with backgroundColor: 'var(--color-danger)'
content = content.replace(/background:\s*'var\(--color-danger\)'/g, "backgroundColor: 'var(--color-danger)'");

// Replace background: 'transparent' with backgroundColor: 'transparent'
content = content.replace(/background:\s*'transparent'/g, "backgroundColor: 'transparent'");

// Replace background: 'var(--color-accent-bg, #EFF6FF)' with backgroundColor: 'var(--color-accent-bg, #EFF6FF)'
content = content.replace(/background:\s*'var\(--color-accent-bg, #EFF6FF\)'/g, "backgroundColor: 'var(--color-accent-bg, #EFF6FF)'");

// Replace background: '#F8FAFC' with backgroundColor: '#F8FAFC'
content = content.replace(/background:\s*'#F8FAFC'/g, "backgroundColor: '#F8FAFC'");

// Replace background: '#F0F2FF' with backgroundColor: '#F0F2FF'
content = content.replace(/background:\s*'#F0F2FF'/g, "backgroundColor: '#F0F2FF'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed background properties in Tasks.jsx');
