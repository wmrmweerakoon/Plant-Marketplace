import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import the background image
import backgroundImage from '../assets/ai .png';

const PlantCareAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your plant care assistant. Ask me anything about plants, care tips, or treatment methods.", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Gemini API to get plant care advice
      console.log('Making API call to:', `${import.meta.env.VITE_API_BASE_URL}/plant-care/gemini`);
      console.log('Prompt:', inputValue);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plant-care/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text(); // Get raw response to see error details
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        // Try to parse error response
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        
        console.log('Server error response:', errorData);
        
        // Check if it's a configuration error (like missing API key)
        if (response.status === 500 && errorData.message && errorData.message.includes('GEMINI_API_KEY')) {
          throw new Error('API configuration error: GEMINI_API_KEY is not set up properly on the server.');
        } else if (response.status === 500) {
          throw new Error(`Server error: ${errorData.message || 'Internal server error'}`);
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please ensure the server is running and the route is properly configured.');
        } else if (response.status === 400) {
          throw new Error(`Bad request: ${errorData.error || 'Invalid input'}`);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}. ${errorData.error || errorData.message || 'Unknown error'}`);
        }
      }

      // Parse successful response
      const data = JSON.parse(responseText);
      const aiMessage = { id: Date.now() + 1, text: data.response, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      console.error('Error details:', error.message);
      
      // Provide more specific error messages
      let errorMessageText = "Sorry, I encountered an error processing your request. ";
      
      if (error.message.includes('API configuration')) {
        errorMessageText += "The plant care assistant is not properly configured on the server. Please contact the administrator to set up the GEMINI_API_KEY.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessageText += "Unable to connect to the server. Please check your connection.";
      } else if (error.message.includes('API endpoint not found')) {
        errorMessageText += "The server endpoint is not available. Please ensure the server is running and restart it after adding the new features.";
      } else if (error.message.includes('Bad request')) {
        errorMessageText += "Invalid request sent to the server.";
      } else {
        errorMessageText += `Error: ${error.message}. Please try again later.`;
      }
      
      const errorMessage = { 
        id: Date.now() + 1, 
        text: errorMessageText, 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

   return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-emerald-10/70 z-0"></div> {/* Increased opacity for better contrast */}
      <div className="max-w-4xl mx-auto relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-green-900 mb-4 flex items-center justify-center gap-2 drop-shadow-lg">
            <span className="text-5xl">🌿</span> Plant Care Assistant
          </h1>
          <p className="text-lg text-green-800 max-w-2xl mx-auto bg-white/90 rounded-full px-6 py-3 shadow-lg font-medium">
            Get expert advice on plant care, treatment methods, and growing tips from our AI assistant
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-green-200"
        >
          <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-100 to-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-green-900 flex items-center gap-2">
              <span className="text-2xl">💬</span> Ask me anything about plants!
            </h2>
            <p className="text-sm text-green-800 mt-1 flex items-center gap-1">
              <span className="text-lg">💡</span> Get care tips, treatment advice, and growing recommendations
            </p>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-white/50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-br-none'
                      : 'bg-gradient-to-r from-green-100 to-emerald-100 text-gray-900 rounded-bl-none border border-green-300'
                  }`}
                >
                  {message.sender === 'ai' ? (
                    <div className="text-sm leading-relaxed text-gray-800">
                      {message.text.split('\n').map((line, index) => {
                        // Check if the line starts with a bullet point or numbered list
                        if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim())) {
                          return (
                            <div key={index} className="flex items-start mb-2 ml-1 bg-white/90 rounded-lg px-3 py-1.5 border-l-4 border-green-600 shadow-sm">
                              <span className="mr-2 text-green-700 font-bold text-base">•</span>
                              <span className="text-gray-800 font-medium">{line.replace(/^- |^\* |^\d+\.\s/, '')}</span>
                            </div>
                          );
                        }
                        // If it's a longer paragraph, wrap it in a div
                        else if (line.trim() !== '') {
                          return (
                            <div key={index} className="mb-2 pl-5 text-gray-700">
                              <span>{line}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-white">{message.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-xs lg:max-w-md px-5 py-3 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 rounded-bl-none border border-green-300 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2 text-sm text-green-800 font-medium">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-t border-green-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about plant care, treatment, or growing tips..."
                className="flex-1 border-2 border-green-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white shadow-md transition-all duration-200 focus:shadow-lg"
                rows="2"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all duration-200 ${
                  isLoading || !inputValue.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </div>
            <div className="mt-4 p-4 bg-white/90 rounded-xl border border-green-200 shadow-sm">
              <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <span>💡</span> Example questions:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-green-800">
                <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">How often should I water my succulents?</div>
                <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">What are common problems with indoor plants?</div>
                <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">Best fertilizer for flowering plants?</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-30"
          >
            <div className="text-green-700 text-3xl mb-4">🌱</div>
            <h3 className="font-bold text-lg text-green-900 mb-3">Care Tips</h3>
            <p className="text-green-800">Get personalized care instructions for different plant types</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-green-700 text-3xl mb-4">🌿</div>
            <h3 className="font-bold text-lg text-green-900 mb-3">Treatment Methods</h3>
            <p className="text-green-800">Learn how to treat common plant diseases and pests</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-green-700 text-3xl mb-4">💧</div>
            <h3 className="font-bold text-lg text-green-900 mb-3">Growing Advice</h3>
            <p className="text-green-800">Expert guidance on optimal growing conditions</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlantCareAssistant;
