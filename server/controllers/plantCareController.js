const axios = require('axios');

const getPlantCareAdvice = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Validate input
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if GEMINI_API_KEY is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY is not configured on the server',
        message: 'GEMINI_API_KEY environment variable is missing. Please configure it in the server environment.' 
      });
    }

    // Construct a prompt specifically for plant care
    const plantCarePrompt = `As a plant care expert, please provide concise advice about: "${prompt}". Format your response with short bullet points covering: care instructions, treatment methods, watering schedules, light requirements, and other relevant information for plant owners. Keep each point brief and actionable. Use markdown-style bullet points (-) and limit your total response to 5-8 bullet points maximum.`;

    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: plantCarePrompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Extract the response from Gemini API
    const geminiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    
    res.json({
      response: geminiResponse
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Gemini API Error Details:', error.response.status, error.response.data);
      console.error('Gemini API Full Response:', JSON.stringify(error.response.data, null, 2));
      return res.status(500).json({ 
        error: 'Failed to get plant care advice',
        message: `Gemini API Error: ${error.response.data.error?.message || error.response.data.error || 'Unknown error'}`,
        status: error.response.status,
        details: error.response.data
      });
    } else if (error.code === 'ENOTFOUND') {
      // Network error
      return res.status(500).json({ 
        error: 'Network error',
        message: 'Unable to connect to the Gemini API' 
      });
    } else {
      // Something else happened
      console.error('Unexpected error:', error);
      return res.status(500).json({ 
        error: 'Failed to get plant care advice',
        message: error.message 
      });
    }
  }
};

module.exports = {
  getPlantCareAdvice
};
