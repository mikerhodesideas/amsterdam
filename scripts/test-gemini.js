const GEMINI_API_KEY = ''

const PROMPT = "What are google ads scripts?"

function main() {
    try {
        let start = new Date();
        let model = "gemini-2.0-flash" // Use gemini-pro for best results
        let output = generateTextGemini(PROMPT, API_KEY, model); // output
        Logger.log('Text output: ' + output);

        let end  = new Date();
        let dur = (end - start) / 1000;
        Logger.log('Time taken for script to run: ' + dur + ' seconds.');

    } catch (error) {
        Logger.log('An error occurred: ' + error);
    }
}

function generateTextGemini(prompt, apiKey, model) {
    Logger.log('Generating report with Gemini');

    let data = {
        'contents': [{
            'parts': [{
                'text': prompt
            }]
        }],
        'generationConfig': {
            'maxOutputTokens': 1000
        }
    };

    let httpOptions = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(data)
    };

    try {
        let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        let response = UrlFetchApp.fetch(url, httpOptions);
        let status = response.getResponseCode(); // Get HTTP status code
        Logger.log('Status code: ' + status);
        let responseJson = JSON.parse(response.getContentText());
        let text = responseJson.candidates[0].content.parts[0].text; // Access the nested text
        return text
    } catch (error) {
        Logger.log('Error fetching data from Gemini API: ' + error);
        return error.toString(); // Return error details
    }
}