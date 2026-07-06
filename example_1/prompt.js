const fs = require('fs');
const path = require('path');

const systemPrompt = fs.readFileSync(
  path.join(__dirname, 'system-prompt.txt'),
  'utf-8',
);

// Returns an Anthropic-style chat array. promptfoo's anthropic provider
// hoists the `system` message into the top-level system parameter.
module.exports = function ({ vars }) {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: vars.question },
  ];
};
