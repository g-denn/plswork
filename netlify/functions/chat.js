require('dotenv').config();
const fetch = require('node-fetch');

const handler = async (event) => {
  // Check for allowed origins
  const allowedOrigins = [
    'http://localhost:8888',    // Netlify dev server
    'http://localhost:3000',    // Alternative local dev
    'https://real-token.netlify.app'  // Your production domain
  ];

  const origin = event.headers.origin;
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // CORS headers
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (isAllowedOrigin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Check for API key and validate format
  const apiKey = process.env.PERPLEXITY_API_KEY?.trim();
  if (!apiKey || !apiKey.startsWith('pplx-')) {
    console.error('Invalid API key format');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Configuration error',
        details: 'Invalid API key format'
      })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    // Log request details (remove in production)
    console.log('Making API request with:', {
      apiKeyValid: apiKey.startsWith('pplx-'),
      apiKeyLength: apiKey.length,
      messagePreview: message.substring(0, 50) + '...'
    });

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    // Log response details
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: messageContent,
        citations: []
      })
    };

  } catch (error) {
    console.error('Error details:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message
      })
    };
  }
};

module.exports = { handler }; 