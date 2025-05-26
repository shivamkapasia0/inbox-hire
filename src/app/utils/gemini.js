import { GoogleGenerativeAI } from '@google/generative-ai';

export async function categorizeEmailWithGemini(email, settings) {
  try {
    console.log('Starting Gemini categorization...');
    
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
    const prompt = `Analyze this email and categorize it based on the following criteria:
    - If it's a rejection email, respond with "rejected"
    - If it's an interview invitation or scheduling, respond with "interview"
    - If it's a job offer, respond with "offer"
    - If none of the above, respond with "other"

    Email Subject: ${email.subject}
    Email Body: ${email.text}

    Respond with ONLY one of these words: rejected, interview, offer, other`;

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
        const category = response.text().trim().toLowerCase();

        console.log('Received response from Gemini:', category);

        // Validate the response
        const validCategories = ['rejected', 'interview', 'offer', 'other'];
        if (!validCategories.includes(category)) {
          throw new Error(`Invalid category received: ${category}`);
        }

        console.log('Successfully categorized email as:', category);
        return category;
      } catch (error) {
        console.error(`Gemini API attempt ${4 - retries} failed:`, error);
        lastError = error;
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }

    throw lastError || new Error('Failed to categorize email with Gemini');
  } catch (error) {
    console.error('Error in Gemini categorization:', error);
    throw error;
  }
} 