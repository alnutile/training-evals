// Custom promptfoo provider for the target chatbot.
//
// Why this exists: promptfoo's built-in anthropic provider always sends
// `temperature`, but claude-sonnet-5 (Claude 5 family) rejects that parameter
// ("`temperature` is deprecated for this model"). This provider calls the
// Anthropic Messages API directly and only sends the fields we choose.

class AnthropicTargetProvider {
  constructor(options = {}) {
    this.config = options.config || {};
    this.providerId = options.id || 'anthropic-sonnet5-target';
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt) {
    // prompt.js returns a chat array; promptfoo hands it to us as a JSON string.
    let system;
    let messages;
    try {
      const parsed = JSON.parse(prompt);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      system = arr.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
      messages = arr
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content }));
    } catch {
      messages = [{ role: 'user', content: String(prompt) }];
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { error: 'ANTHROPIC_API_KEY is not set' };
    }

    const body = {
      model: this.config.model || 'claude-sonnet-5',
      max_tokens: this.config.max_tokens || 400,
      messages,
    };
    if (system) body.system = system;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: `API ${res.status}: ${JSON.stringify(data)}` };
      }

      const output = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');

      return {
        output,
        tokenUsage: data.usage
          ? {
              prompt: data.usage.input_tokens,
              completion: data.usage.output_tokens,
              total: data.usage.input_tokens + data.usage.output_tokens,
            }
          : undefined,
      };
    } catch (err) {
      return { error: `Request failed: ${err.message}` };
    }
  }
}

module.exports = AnthropicTargetProvider;
