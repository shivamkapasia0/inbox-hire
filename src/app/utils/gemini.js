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
    const prompt = `Fill in this JSON structure based on the email content:

    {
      "id": "${Date.now()}",
      "from": "${email.from}",
      "to": "${email.to}",
      "subject": "${email.subject}",
      "text": "${email.text}",
      "html": "${email.html || null}",
      "date": "${email.date}",
      "status": "rejected|interview|offer|other",
      "jobTitle": "extract from subject or text",
      "type": "fullTime|partTime|contract|internship",
      "company": "extract from email domain or text",
      "location": "extract from text",
      "salary": "extract from text",
      "nextSteps": "extract from text"
    }

    Rules for status:
    - Use "rejected" if email indicates rejection
    - Use "interview" if email is about scheduling/confirming interview
    - Use "offer" if email contains job offer
    - Use "other" for all other cases`;

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
        
        // Clean the response text by removing markdown code block syntax
        const cleanedResponse = responseText
          .replace(/```json\n?/g, '')  // Remove opening ```json
          .replace(/```\n?/g, '')      // Remove closing ```
          .trim();                     // Remove any extra whitespace
        
        // Parse the JSON response
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(cleanedResponse);
          console.log('Original Gemini response:', JSON.stringify(parsedResponse, null, 2));
          
          // Function to aggressively flatten nested JSON
          const flattenJson = (obj) => {
            const result = {};
            
            const flatten = (current, prefix = '') => {
              Object.entries(current).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}_${key}` : key;
                
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                  // If it's a nested object, flatten it
                  flatten(value, newKey);
                } else {
                  // If it's a primitive value or array, keep it
                  result[newKey] = value;
                }
              });
            };

            flatten(obj);
            
            // Remove any nested prefixes we don't want
            const cleanedResult = {};
            Object.entries(result).forEach(([key, value]) => {
              // Remove any nested prefixes (e.g., "status_value" becomes "status")
              const cleanKey = key.split('_').pop();
              cleanedResult[cleanKey] = value;
            });
            
            return cleanedResult;
          };

          // Flatten the response
          parsedResponse = flattenJson(parsedResponse);
          console.log('Flattened response:', JSON.stringify(parsedResponse, null, 2));
        } catch (parseError) {
          console.error('Failed to parse Gemini response as JSON:', parseError);
          throw new Error('Invalid JSON response from Gemini');
        }

        // Validate the status
        const validStatuses = ['rejected', 'interview', 'offer', 'other'];
        if (!validStatuses.includes(parsedResponse.status)) {
          console.error('Invalid status received:', parsedResponse.status);
          throw new Error(`Invalid status received: ${parsedResponse.status}`);
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