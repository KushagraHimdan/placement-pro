const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The structured shape we want the model to respond in
const scoreResumeMatchTool = {
  type: 'function',
  function: {
    name: 'scoreResumeMatch',
    description: 'Scores how well a candidate resume matches a job drive, with reasoning.',
    parameters: {
      type: 'object',
      properties: {
        matchScore: {
          type: 'number',
          description: 'A score from 0 to 100 representing how well the resume matches the role',
        },
        strengths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Short bullet points on why the candidate fits well',
        },
        concerns: {
          type: 'array',
          items: { type: 'string' },
          description: 'Short bullet points on gaps or mismatches',
        },
        summary: {
          type: 'string',
          description: 'A one-sentence overall assessment',
        },
      },
      required: ['matchScore', 'strengths', 'concerns', 'summary'],
    },
  },
};

// Scores a single resume against a single drive's role/description
const scoreResume = async (resumeText, drive) => {
  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an assistant that evaluates how well a candidate resume matches a job opening. Always respond by calling the scoreResumeMatch function.',
      },
      {
        role: 'user',
        content: `Job Role: ${drive.role}\nJob Description: ${drive.description || 'N/A'}\n\nCandidate Resume:\n${resumeText}`,
      },
    ],
    tools: [scoreResumeMatchTool],
    tool_choice: { type: 'function', function: { name: 'scoreResumeMatch' } },
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  if (!toolCall) {
    throw new Error('AI did not return a structured tool call');
  }

  const result = JSON.parse(toolCall.function.arguments);
  return result;
};

module.exports = { scoreResume };