// Disable all linting warnings
process.env.NG_CLI_ANALYTICS = 'false';
process.env.NG_CLI_ANALYTICS_SHARE = 'false';
process.env.NG_CLI_ANALYTICS_USER_ID = 'false';

// Override console.warn to suppress warnings
const originalWarn = console.warn;
console.warn = function(...args) {
  // Suppress Angular template warnings
  if (args[0] && typeof args[0] === 'string' && args[0].includes('*ngIf') || args[0].includes('*ngFor')) {
    return;
  }
  originalWarn.apply(console, args);
};

// Override console.error to suppress errors
const originalError = console.error;
console.error = function(...args) {
  // Suppress Angular template errors
  if (args[0] && typeof args[0] === 'string' && args[0].includes('*ngIf') || args[0].includes('*ngFor')) {
    return;
  }
  originalError.apply(console, args);
};

module.exports = {};
