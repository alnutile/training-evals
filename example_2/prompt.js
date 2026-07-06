const fs = require('fs');
const path = require('path');

const systemPrompt = fs.readFileSync(
  path.join(__dirname, 'extraction-prompt.txt'),
  'utf-8',
);

// Each CSV row provides `email` (the full raw email text) as a var.
module.exports = function ({ vars }) {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Extract the fields from this email:\n\n${vars.email}` },
  ];
};
