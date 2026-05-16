const axios = require('axios');

class AIService {
  constructor() {
    this.watsonxUrl = process.env.WATSONX_URL;
    this.watsonxApiKey = process.env.WATSONX_API_KEY;
    this.watsonxProjectId = process.env.WATSONX_PROJECT_ID;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async reviewCode(changes, context = {}) {
    const prompt = this.buildReviewPrompt(changes, context);
    
    try {
      // Try IBM watsonx.ai first
      const response = await this.callWatsonx(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.log('Watsonx failed, falling back to OpenAI:', error.message);
      // Fallback to OpenAI
      const response = await this.callOpenAI(prompt);
      return this.parseResponse(response);
    }
  }

  buildReviewPrompt(changes, context) {
    const changesSummary = changes.map(c => 
      `File: ${c.file}\nLanguage: ${c.language}\nAdded: ${c.addedLines} lines\nRemoved: ${c.removedLines} lines`
    ).join('\n\n');

    return `You are an expert code reviewer. Analyze the following code changes.

CHANGES:
${changesSummary}

CODE DETAILS:
${changes.map(c => c.content).join('\n\n')}

INSTRUCTIONS:
1. Review for code quality, security, performance, and best practices
2. Identify specific issues with line numbers
3. Suggest concrete improvements
4. Classify severity: CRITICAL, HIGH, MEDIUM, LOW, INFO

OUTPUT FORMAT (JSON only):
{
  "findings": [
    {
      "file": "path/to/file",
      "line": 42,
      "severity": "HIGH",
      "category": "security",
      "issue": "Brief description",
      "explanation": "Detailed explanation",
      "suggestion": "How to fix"
    }
  ],
  "summary": "Overall assessment",
  "score": 85,
  "strengths": ["Good practices"],
  "improvements": ["Areas to improve"]
}

Respond ONLY with valid JSON.`;
  }

  async callWatsonx(prompt) {
    const response = await axios.post(
      this.watsonxUrl,
      {
        model_id: 'ibm/granite-13b-chat-v2',
        input: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.3,
          top_p: 0.9
        },
        project_id: this.watsonxProjectId
      },
      {
        headers: {
          'Authorization': `Bearer ${this.watsonxApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data.results[0].generated_text;
  }

  async callOpenAI(prompt) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are an expert code reviewer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data.choices[0].message.content;
  }

  parseResponse(response) {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!result.findings) result.findings = [];
    if (!result.summary) result.summary = 'No summary provided';
    if (!result.score) result.score = 50;

    return result;
  }
}

module.exports = new AIService();

// Made with Bob
