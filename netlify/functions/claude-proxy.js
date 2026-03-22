// Netlify Serverless Function - Claude API Proxy
// This keeps your API key secure on the server side

export default async (request, context) => {
  // CORS headers for frontend requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse the incoming request
    const { message, history = [] } = await request.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from Netlify environment variables
    const apiKey = Netlify.env.get('ANTHROPIC_API_KEY');

    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // System prompt for the AI assistant
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

    // Build messages array from history
    const messages = [];

    // Add conversation history
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

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
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API returned ${response.status}`);
    }

    const data = await response.json();

    // Return the AI response
    return new Response(
      JSON.stringify({
        response: data.content[0].text,
        role: 'assistant'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get response from AI' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
