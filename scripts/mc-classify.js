// Configuration and constants
const SHEET_URL = ''; // Create new sheet if not provided
const APIKEY = ''; // Replace with your actual API key
const MODEL = 'gpt-4o-mini';

const CATEGORIES = {
    INFORMATIONAL: 'Queries seeking general information',
    NAVIGATIONAL: 'Queries looking for a specific website or page',
    COMMERCIAL: 'Queries with buying intent',
    LOCAL: 'Queries related to local businesses or services',
    QUESTION: 'Queries phrased as questions',
    OTHER: 'Other'
};

function main() {
    try {
        Logger.log('Starting search term classification process');
        const settings = getSheetSettings();

        // Check at least 1 term exists
        if (!settings.searchTerms || settings.searchTerms.length === 0) {
            Logger.log('Error: No search terms found');
            return;
        }

        const results = processSearchTerms(settings.searchTerms);
        writeResultsToSheet(results, settings.spreadsheet);
        Logger.log('Classification process completed successfully');
    } catch (error) {
        Logger.log(`Error in main execution: ${error.message}`);
        throw error;
    }
}

function getSheetSettings() {
    try {
        const spreadsheet = SpreadsheetApp.openByUrl(SHEET_URL);
        return {
            spreadsheet: spreadsheet,
            searchTerms: spreadsheet.getRangeByName('topTerms').getValues()
        };
    } catch (error) {
        Logger.log(`Error getting sheet settings: ${error.message}`);
        throw error;
    }
}

function processSearchTerms(searchTerms) {
    const results = [];
    const prompt = createClassificationPrompt();

    for (let i = 0; i < searchTerms.length; i++) {
        const term = searchTerms[i][0];
        if (!term) continue;

        try {
            Logger.log(`Processing term (${i + 1}/${searchTerms.length}): ${term}`);

            const fullPrompt = prompt.replace('{SEARCH_TERM}', term);
            const response = generateTextOpenAI(fullPrompt);
            const parsed = parseOpenAIResponse(response);

            results.push({
                term: term,
                category: parsed.category,
                explanation: parsed.explanation
            });

            Utilities.sleep(1000);
        } catch (error) {
            Logger.log(`Error processing term "${term}": ${error.message}`);
            results.push({
                term: term,
                category: 'ERROR',
                explanation: error.message
            });
        }
    }

    return results;
}

function createClassificationPrompt() {
    const categoriesText = Object.entries(CATEGORIES)
        .map(([category, description]) => `${category}: ${description}`)
        .join('\n');

    const prompt = `
        Classify the following search term into one of these categories:\n\n${categoriesText}\n\n
        Search term: "{SEARCH_TERM}"\n\n
        Respond in this format only:\n
        Category: [CATEGORY_NAME]\n
        Explanation: [Brief explanation for the classification]
        `;

    return prompt;
}

function parseOpenAIResponse(response) {
    const categoryMatch = response.match(/Category:\s*([A-Z]+)/i);
    const explanationMatch = response.match(/Explanation:\s*(.+)/i);

    if (!categoryMatch || !explanationMatch) {
        throw new Error('Unable to parse AI response');
    }

    return {
        category: categoryMatch[1].trim().toUpperCase(),
        explanation: explanationMatch[1].trim()
    };
}

function writeResultsToSheet(results, spreadsheet) {
    try {
        let resultsSheet = spreadsheet.getSheetByName('Results');
        resultsSheet = resultsSheet ? (resultsSheet.clearContents(), resultsSheet) : spreadsheet.insertSheet('Results');

        // Prepare data with headers and results in a single array
        const headers = [['Search Term', 'Category', 'Explanation']];
        const data = results.length > 0 
            ? [...headers, ...results.map(r => [r.term, r.category, r.explanation])]
            : headers;
            
        // Write all data at once 
        resultsSheet.getRange(1, 1, data.length, 3).setValues(data);

        resultsSheet.activate();
    } catch (error) {
        Logger.log(`Error writing results to sheet: ${error.message}`);
        throw error;
    }
}

function generateTextOpenAI(prompt) {
    let url = 'https://api.openai.com/v1/chat/completions';
    let payload = {
        "model": MODEL,
        "messages": [{ "role": "user", "content": prompt }]
    };

    let httpOptions = {
        "method": "POST",
        "muteHttpExceptions": true,
        "contentType": "application/json",
        "headers": { "Authorization": 'Bearer ' + APIKEY },
        'payload': JSON.stringify(payload)
    };

    try {
        let response = UrlFetchApp.fetch(url, httpOptions);
        let responseCode = response.getResponseCode();

        if (responseCode !== 200) {
            throw new Error(`API request failed with status ${responseCode}: ${response.getContentText()}`);
        }

        let responseJson = JSON.parse(response.getContentText());
        let choices = responseJson.choices;

        if (!choices || choices.length === 0) {
            throw new Error('No response choices returned from API');
        }

        return choices[0].message.content;
    } catch (error) {
        Logger.log(`Error in OpenAI API call: ${error.message}`);
        throw error;
    }
}