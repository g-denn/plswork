const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        if (!process.env.PERPLEXITY_API_KEY) {
            throw new Error("Missing Perplexity API key. Please set the PERPLEXITY_API_KEY environment variable.");
        }

        const { address, city, state } = JSON.parse(event.body);
        
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer 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`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "system",
                        content: "When given a property address, city, and state, return the complete property details including estimatedValue, squareFootage, yearBuilt, lotSize, bedrooms, bathrooms, propertyType, lastSaleDate, and lastSalePrice. Your response must be valid JSON and follow this exact format: \n\n{\"propertyData\": {\"estimatedValue\": 350000, \"squareFootage\": 2000, \"yearBuilt\": 1990, \"lotSize\": \"0.5 acres\", \"bedrooms\": 4, \"bathrooms\": 3, \"propertyType\": \"Residential\", \"lastSaleDate\": \"2023-01-01\", \"lastSalePrice\": 340000}}\n\nDo not include any additional explanation or markdown formatting. Output only the JSON."
                    },
                    {
                        role: "user",
                        content: `Provide property details for ${address}, ${city}, ${state} using data in JSON format.`
                    }
                ],
            })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);

        if (!response.ok) {
            let errorText = await response.text();
            if (response.status === 401) {
                errorText = "Unauthorized: Please verify your API key.";
            }
            throw new Error(`Perplexity API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        console.log("Full Perplexity Response:", JSON.stringify(data, null, 2));
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error('Invalid API response format: ' + JSON.stringify(data));
        }
        
        let content = data.choices[0].message.content.trim();
        if (content.startsWith("```")) {
            content = content.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
        }
        
        const propertyData = JSON.parse(content);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ propertyData })
        };

    } catch (error) {
        console.error('Error details:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch property data',
                details: error.message,
                stack: error.stack
            })
        };
    }
};

module.exports = { handler }; 