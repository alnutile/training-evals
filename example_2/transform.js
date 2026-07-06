// Reasoning models can wrap the JSON in <think> blocks or ```json fences.
// Extract just the JSON object so is-json and the rubric see clean input.
module.exports = (output) => {
  let o = String(output)
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```json/gi, '')
    .replace(/```/g, '');
  const a = o.indexOf('{');
  const b = o.lastIndexOf('}');
  return a >= 0 && b > a ? o.slice(a, b + 1).trim() : o.trim();
};
