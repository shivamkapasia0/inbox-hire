import { GoogleGenerativeAI } from '@google/generative-ai';

export async function categorizeEmailWithGemini(email, settings) {
  try {
    console.log('Starting Gemini categorization and information extraction...');
    
    // Check if Gemini API key is configured
    if (!settings?.api?.geminiKey) {
      console.log('No Gemini API key found in settings');
      throw new Error('Gemini API key not configured');
    }

    // Initialize Gemini with the API key and correct endpoint
    const genAI = new GoogleGenerativeAI(settings.api.geminiKey, {
      apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash'
    });

    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Prepare the prompt
    const prompt = `Analyze this email and provide the following information in JSON format:
    1. Category (must be one of: "rejected", "interview", "offer", "other")
    2. Company name (if mentioned)
    3. Position/Job title (if mentioned)
    4. Date (if mentioned, in YYYY-MM-DD format)
    5. Location (if mentioned)
    6. Salary/Compensation (if mentioned)
    7. Next steps or action items (if mentioned)

    Email Subject: ${email.subject}
    Email Body: ${email.text}

    Respond with a JSON object containing these fields. Use null for any information not found.`;

    console.log('Sending request to Gemini...');

    // Get response from Gemini with retry logic
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const result = await model.generateContent({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        });
        const response = await result.response;
        const responseText = response.text().trim();
        
        // Parse the JSON response
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse Gemini response as JSON:', parseError);
          throw new Error('Invalid JSON response from Gemini');
        }

        // Validate the category
        const validCategories = ['rejected', 'interview', 'offer', 'other'];
        if (!validCategories.includes(parsedResponse.category)) {
          throw new Error(`Invalid category received: ${parsedResponse.category}`);
        }

        console.log('Successfully processed email:', parsedResponse);
        return parsedResponse;
      } catch (error) {
        console.error(`Gemini API attempt ${4 - retries} failed:`, error);
        lastError = error;
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }

    throw lastError || new Error('Failed to process email with Gemini');
  } catch (error) {
    console.error('Error in Gemini processing:', error);
    throw error;
  }
} 