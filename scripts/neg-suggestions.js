// Negative Keywords Script
// Finds potential negative keywords from the last 30 days

// Copy this template sheet: 
// https://docs.google.com/spreadsheets/d/1yre6ndK9L6H2VQNNP3LLfqW8rHOT96uEZqp6zun5D8A/edit?usp=sharing


const SHEET_URL = ''; // Create new sheet if not provided


function main() {
    try {
        // Open the spreadsheet
        const ss = SHEET_URL ? SpreadsheetApp.openByUrl(SHEET_URL) : SpreadsheetApp.getActiveSpreadsheet();

        // Get thresholds from named ranges
        const minClicks = getNamedRangeValue(ss, 'MIN_CLICKS');
        const minCost = getNamedRangeValue(ss, 'MIN_COST');
        const minConversions = getNamedRangeValue(ss, 'MIN_CONVERSIONS');

        // Check if required named ranges exist
        if (minClicks === null || minCost === null || minConversions === null) {
            Logger.log("ERROR: Required named ranges (MIN_CLICKS, MIN_COST, MIN_CONVERSIONS) not found in the spreadsheet.");
            return;
        }

        // Get potential negative keywords and already negated terms
        const { results, alreadyNegged } = getPotentialNegativeKeywords(minClicks, minCost, minConversions);

        // Write results to sheets
        if (results.length > 0) {
            writeResultsToSheet(ss, results, 'Negative Keywords');
        } else {
            Logger.log("No potential negative keywords found.");
        }

        if (alreadyNegged.length > 0) {
            writeResultsToSheet(ss, alreadyNegged, 'Already Negated');
        }

    } catch (e) {
        Logger.log("Error running script: " + e);
    }
}

function getNamedRangeValue(ss, rangeName) {
    const namedRange = ss.getRangeByName(rangeName);
    return namedRange ? namedRange.getValue() : null;
}

function getPotentialNegativeKeywords(minClicks, minCost, minConversions) {
    const results = [];
    const alreadyNegged = [];  // New array for already negated terms


    // Query to get underperforming search terms
    const query =
        `
      SELECT search_term_view.search_term, campaign.name, campaign.id, 
      ad_group.name, ad_group.id,
      metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions 
      FROM search_term_view 
      WHERE metrics.clicks > ${minClicks} 
      AND metrics.cost_micros > ${minCost * 1000000} 
      AND metrics.conversions < ${minConversions} 
      AND campaign.status = ENABLED 
      AND segments.date DURING LAST_30_DAYS 
      ORDER BY metrics.cost_micros DESC
      `;
    try {
        const result = AdsApp.search(query);

        while (result.hasNext()) {
            const row = result.next();

            const searchTerm = row.searchTermView.searchTerm;
            const campaignName = row.campaign.name;
            const campaignId = row.campaign.id;
            const adGroupName = row.adGroup.name;
            const adGroupId = row.adGroup.id;
            const impressions = row.metrics.impressions;
            const clicks = row.metrics.clicks;
            const cost = (row.metrics.costMicros / 1000000).toFixed(2);
            const conversions = parseFloat(row.metrics.conversions.toFixed(2));
            const CTR = (clicks / impressions * 100).toFixed(2) + '%';
            const CvR = (conversions / clicks * 100).toFixed(2) + '%';
            const CPC = (cost / clicks).toFixed(2);

            // Check if already negated
            const isNegged = isNegatedInCampaign(searchTerm, campaignId) || isNegatedInAdGroup(searchTerm, adGroupId);

            // Store data in appropriate array
            if (isNegged) {
                alreadyNegged.push([campaignName, adGroupName, searchTerm, impressions, clicks, cost, conversions, CTR, CvR, CPC, "Already Negated"]);
            } else {
                results.push([campaignName, adGroupName, searchTerm, impressions, clicks, cost, conversions, CTR, CvR, CPC]);
            }
        }
    } catch (e) {
        Logger.log("Query error: " + e);
    }

    return { results, alreadyNegged };  // Return both arrays
}

function isNegatedInCampaign(keyword, campaignId) {
    const negKeywords = getCampaignNegativeKeywords(campaignId);

    for (let i = 0; i < negKeywords.length; i++) {
        if (negativeBlocksPositive(negKeywords[i], keyword)) {
            return true;
        }
    }

    return false;
}

function isNegatedInAdGroup(keyword, adGroupId) {
    const negKeywords = getAdGroupNegativeKeywords(adGroupId);

    for (let i = 0; i < negKeywords.length; i++) {
        if (negativeBlocksPositive(negKeywords[i], keyword)) {
            return true;
        }
    }

    return false;
}

function getCampaignNegativeKeywords(campaignId) {
    const negKeywords = [];
    const campaignIds = [campaignId];

    // Get campaign-level negatives
    const campaignIterator = AdsApp.campaigns().withIds(campaignIds).get();

    if (campaignIterator.hasNext()) {
        const campaign = campaignIterator.next();

        // Direct campaign negatives
        const negKWIterator = campaign.negativeKeywords().get();
        while (negKWIterator.hasNext()) {
            negKeywords.push(negKWIterator.next());
        }

        // Shared negative lists
        const negListIterator = campaign.negativeKeywordLists().get();
        while (negListIterator.hasNext()) {
            const negList = negListIterator.next();
            const negListKWIterator = negList.negativeKeywords().get();

            while (negListKWIterator.hasNext()) {
                negKeywords.push(negListKWIterator.next());
            }
        }
    }

    return negKeywords;
}

function getAdGroupNegativeKeywords(adGroupId) {
    const negKeywords = [];
    const adGroupIds = [adGroupId];

    // Get ad group-level negatives
    const adGroupIterator = AdsApp.adGroups().withIds(adGroupIds).get();

    if (adGroupIterator.hasNext()) {
        const adGroup = adGroupIterator.next();

        // Get negative keywords for this ad group
        const negKWIterator = adGroup.negativeKeywords().get();

        while (negKWIterator.hasNext()) {
            negKeywords.push(negKWIterator.next());
        }
    }

    return negKeywords;
}

function negativeBlocksPositive(negKeyword, searchTerm) {
    const matchType = negKeyword.getMatchType();
    const negText = negKeyword.getText();

    switch (matchType) {
        case 'BROAD':
            return hasAllTokens(negText, searchTerm);
        case 'PHRASE':
            return isSubsequence(negText, searchTerm);
        case 'EXACT':
            return searchTerm === negText.replace('[', '').replace(']', '');
        default:
            return false;
    }
}

function hasAllTokens(negText, searchTerm) {
    const negTokens = negText.split(' ');
    const searchTokens = searchTerm.split(' ');

    for (let i = 0; i < negTokens.length; i++) {
        if (searchTokens.indexOf(negTokens[i]) === -1) {
            return false;
        }
    }

    return true;
}

function isSubsequence(negText, searchTerm) {
    return (' ' + searchTerm + ' ').indexOf(' ' + negText + ' ') >= 0;
}

function writeResultsToSheet(ss, results, sheetName) {
    let sheet = ss.getSheetByName(sheetName);

    // Create sheet if it doesn't exist
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
    }

    // Headers - add Status column if this is the Already Negated sheet
    let headers = [
        "Campaign", "Ad Group", "Search Term", "Impressions", "Clicks",
        "Cost", "Conversions", "CTR", "CvR", "CPC"
    ];

    if (sheetName === 'Already Negated') {
        headers.push("Status");
    }

    // Single write operation - append data including headers
    const dataToWrite = [headers].concat(results);
    sheet.getRange(1, 1, dataToWrite.length, headers.length).setValues(dataToWrite);

    Logger.log(`Found ${results.length} ${sheetName}. Results written to '${sheetName}' sheet.`);
}