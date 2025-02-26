require('dotenv').config();
const fetch = require('node-fetch');

const handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Get API key from Netlify environment variables
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey || !apiKey.startsWith('pplx-')) {
    console.error('API key not properly configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Configuration error',
        details: 'API key not properly configured'
      })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    if (!message) {
      throw new Error('No message provided');
    }

    console.log('Using API key:', apiKey); // Debug log

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are TokenAI, an expert in blockchain-based insurance tokenization. Keep answers concise (max 2 sentences). Always advocate for the benefits of tokenization in insurance, emphasizing transparency, efficiency, and community resilience. Focus on how tokenization solves traditional insurance problems. Ensure that you only answer questions which are relevant to tokenization. Show a relevant and brief message explaining that you cannot answer questions which are not specifically about tokenization."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      throw new Error('No message content in response');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: messageContent,
        citations: []
      })
    };

  } catch (error) {
    console.error('Error details:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message
      })
    };
  }
};

module.exports = { handler }; 