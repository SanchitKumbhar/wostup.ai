const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace root
const newRoot = `:root {
  --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-display: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  
  /* Core Backgrounds */
  --color-bg: #F9FAFB;
  --color-surface: #FFFFFF;
  
  /* Text */
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  
  /* Borders & Shadows */
  --color-border: #E5E7EB;
  --color-border-hover: #D1D5DB;
  
  /* Accents */
  --color-accent: #2563EB;
  --color-accent-hover: #1D4ED8;
  
  /* Semantic Status */
  --color-success: #059669;
  --color-success-bg: #ECFDF5;
  --color-warning: #D97706;
  --color-warning-bg: #FFFBEB;
  --color-danger: #DC2626;
  --color-danger-bg: #FEF2F2;
  --color-neutral: #6B7280;
  --color-neutral-bg: #F3F4F6;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-focus: 0 0 0 2px #fff, 0 0 0 4px var(--color-accent);

  --card-radius: 12px;
  --card-radius-lg: 16px;
}`;
css = css.replace(/:root\s*\{[\s\S]*?\}/, newRoot);

// Mapping replacements
const replacements = [
  ['var(--bg-workspace)', 'var(--color-bg)'],
  ['var(--bg-sidebar)', 'var(--color-surface)'],
  ['var(--card-bg)', 'var(--color-surface)'],
  ['var(--glass-bg)', 'var(--color-surface)'],
  
  ['var(--text-main)', 'var(--color-text-primary)'],
  ['var(--text-muted)', 'var(--color-text-secondary)'],
  ['var(--text-light)', 'var(--color-text-muted)'],
  
  ['var(--primary)', 'var(--color-accent)'],
  ['var(--primary-glow)', 'transparent'],
  ['var(--primary-gradient)', 'var(--color-accent)'],
  ['var(--primary-gradient-hover)', 'var(--color-accent-hover)'],
  
  ['var(--border-light)', 'var(--color-border)'],
  ['var(--border-focus)', 'var(--color-accent)'],
  ['var(--glass-border)', 'var(--color-border)'],
  
  ['var(--status-todo-bg)', 'var(--color-neutral-bg)'],
  ['var(--status-todo-text)', 'var(--color-neutral)'],
  ['var(--status-inprogress-bg)', 'var(--color-warning-bg)'],
  ['var(--status-inprogress-text)', 'var(--color-warning)'],
  ['var(--status-review-bg)', 'var(--color-warning-bg)'],
  ['var(--status-review-text)', 'var(--color-warning)'],
  ['var(--status-completed-bg)', 'var(--color-success-bg)'],
  ['var(--status-completed-text)', 'var(--color-success)'],
  ['var(--status-atrisk-bg)', 'var(--color-danger-bg)'],
  ['var(--status-atrisk-text)', 'var(--color-danger)'],
  
  // Specific visual refactors in CSS
  ['backdrop-filter: blur(16px);', ''],
  ['-webkit-backdrop-filter: blur(16px);', ''],
  ['background-color: #FAFCFF;', 'background-color: var(--color-surface);'],
  ['background: linear-gradient(135deg, #F8F9FD 0%, #F0F2FF 100%);', 'background: var(--color-bg);'],
  ['background-color: #F8F9FD;', 'background-color: var(--color-bg);'],
  ['background-color: #F4F5FA;', 'background-color: var(--color-bg);'],
  ['background-color: #F0F2FF;', 'background-color: #EFF6FF;'],
  ['color: #5B5FFB;', 'color: var(--color-accent);'],
  ['color: #4A5568;', 'color: var(--color-text-secondary);'],
  ['color: #C53030;', 'color: var(--color-danger);'],
  ['background-color: #FFF5F5;', 'background-color: var(--color-danger-bg);'],
  ['border-color: #5B5FFB;', 'border-color: var(--color-accent);'],
  ['color: #6C7A87;', 'color: var(--color-text-secondary);'],
  ['border-color: #B24DFF;', 'border-color: var(--color-accent);'],
  ['background-color: #FEFBFF;', 'background-color: var(--color-bg);'],
  ['rgba(91, 95, 251, 0.25)', 'var(--color-border-hover)'],
  ['rgba(91, 95, 251, 0.15)', 'var(--color-border)'],
  ['linear-gradient(135deg, #10B981 0%, #34D399 100%)', 'var(--color-success)'],
  ['linear-gradient(135deg, #EF4444 0%, #F87171 100%)', 'var(--color-danger)'],
  ['linear-gradient(135deg, #5B5FFB 0%, #B24DFF 100%)', 'var(--color-accent)'],
  ['linear-gradient(90deg, #5B5FFB, #B24DFF)', 'var(--color-accent)'],
  ['linear-gradient(135deg, #5B5FFB, #B24DFF)', 'var(--color-accent)'],
  ['box-shadow: 0 6px 24px rgba(91,95,251,0.3);', ''],
  ['box-shadow: 0 4px 12px rgba(91, 95, 251, 0.2);', ''],
  ['box-shadow: 0 6px 20px rgba(91, 95, 251, 0.35);', ''],
  ['box-shadow: 0 2px 8px rgba(91, 95, 251, 0.2);', ''],
];

replacements.forEach(([oldStr, newStr]) => {
  css = css.split(oldStr).join(newStr);
});

// Manual cleanup for app-container radial gradient which has newlines
css = css.replace(/background:\\s*radial-gradient[\\s\\S]*?var\\(--bg-workspace\\);/g, 'background: var(--color-bg);');

// Manual cleanup for linear gradients with regex
css = css.replace(/background(-image)?:\\s*linear-gradient\\([^)]+\\);/g, 'background: var(--color-accent);');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS updated successfully.');
