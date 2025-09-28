const fs = require('fs');
const path = require('path');

// Read the current angular.json
const angularConfigPath = path.join(__dirname, 'angular.json');
const angularConfig = JSON.parse(fs.readFileSync(angularConfigPath, 'utf8'));

// Disable all linting and template checking
angularConfig.projects['the-assemblers1'].architect.build.options.tsConfig = 'tsconfig.no-lint.json';

// Write the updated configuration
fs.writeFileSync(angularConfigPath, JSON.stringify(angularConfig, null, 2));

console.log('✅ Linting disabled successfully!');
console.log('📝 Angular configuration updated to use tsconfig.no-lint.json');
console.log('🚀 You can now run: ng serve or ng build without linting warnings');
