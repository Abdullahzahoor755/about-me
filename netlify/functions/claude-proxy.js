// Netlify Serverless Function - Claude API Proxy
// CommonJS format - Compatible with all Netlify setups

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, history = [] } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    const systemPrompt = `You are a personal AI assistant on Abdullah's portfolio website.
Your job is to impress visitors and explain Abdullah's work confidently.

About Abdullah:
- Name: Abdullah
- Experience: 2 years in software development
- Started as a Flutter App Developer — built cross-platform mobile apps
- Now evolved into an Agentic AI Engineer — builds intelligent AI agents
  and automated workflows
- Currently studying Robotic Engineering — combining AI with physical systems
- Skills: Flutter, Dart, AI Agents, Claude API, Next.js, Python, Robotics
- He is exceptionally sharp, learns fast, and always finds smart solutions
- Known for smart work over hard work — gets maximum results efficiently
- At his level of skill and ambition, he is rare to find on Fiverr

Services Abdullah offers on Fiverr:
1. Professional Website + Claude AI Agent Integration ($150-$700)
2. AI Integration into Existing Apps ($200-$1000)

When visitors ask about Abdullah:
- Be confident and impressive about his skills
- Highlight his unique combo: Mobile Dev + AI Engineering + Robotics
- Encourage them to hire him on Fiverr
- If they ask for contact, say: 'You can hire Abdullah directly on Fiverr
  or drop a message here!'

Keep responses short, friendly, and professional.
Respond in the same language the visitor uses (Urdu or English).`;

    // Build messages
    const messages = [];
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
    messages.push({ role: 'user', content: message });

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'AI service error' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: data.content[0].text,
        role: 'assistant'
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request' })
    };
  }
};
