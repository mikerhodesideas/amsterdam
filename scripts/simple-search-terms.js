const SHEET_URL = ''; // Will create a new sheet if empty
const TAB = 'Search Terms';

function main() {
  // Define the GAQL query for search terms
  const searchTermQuery = `
  SELECT 
    search_term_view.search_term, 
    campaign.name,
    metrics.impressions, 
    metrics.clicks, 
    metrics.cost_micros, 
    metrics.conversions, 
    metrics.conversions_value
  FROM search_term_view
  WHERE segments.date DURING LAST_30_DAYS
  AND campaign.advertising_channel_type = "SEARCH"
  ORDER BY metrics.cost_micros DESC
  `;

  try {
    // Execute the query
    const searchTermRows = AdsApp.search(searchTermQuery);
    
    // Prepare the spreadsheet
    let ss;
    if (!SHEET_URL) {
      ss = SpreadsheetApp.create("Search Terms Report");
      let url = ss.getUrl();
      Logger.log("No SHEET_URL found, so this sheet was created: " + url);
    } else {
      ss = SpreadsheetApp.openByUrl(SHEET_URL);
    }
    
    // Clear existing data and set up the sheet
    let sheet = ss.getSheetByName(TAB);
    if (!sheet) {
      sheet = ss.insertSheet(TAB);
    } else {
      sheet.clearContents();
    }
    
    // Set up headers
    const headers = ['Search Term', 'Campaign', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'Conv. Value', 'CPC', 'CTR', 'CvR', 'CPA', 'ROAS', 'AOV'];
    
    // Process the data
    const data = processSearchTerms(searchTermRows);
    
    // Write headers and data to sheet in one operation
    if (data.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
      Logger.log(`Exported ${data.length} search terms to the spreadsheet.`);
    } else {
      Logger.log("No search terms found for the specified criteria.");
    }
    
  } catch (e) {
    Logger.log("Error: " + e);
  }
}

function processSearchTerms(rows) {
  const data = [];
  
  while (rows.hasNext()) {
    const row = rows.next();
    
    try {
      // Direct access to fields - using correct property paths
      const searchTerm = row.searchTermView.searchTerm || "";
      const campaignName = row.campaign.name || "";
      
      // Convert string values to numbers and handle null/undefined
      const impressions = parseFloat(row.metrics.impressions) || 0;
      const clicks = parseFloat(row.metrics.clicks) || 0;
      const costMicros = parseFloat(row.metrics.costMicros) || 0;
      const conversions = parseFloat(row.metrics.conversions) || 0;
      const conversionValue = parseFloat(row.metrics.conversionsValue) || 0;
      
      // Calculate metrics
      const cost = costMicros / 1000000;  // Convert micros to actual currency
      const cpc = clicks > 0 ? cost / clicks : 0;
      const ctr = impressions > 0 ? clicks / impressions : 0;
      const convRate = clicks > 0 ? conversions / clicks : 0;
      const cpa = conversions > 0 ? cost / conversions : 0;
      const roas = cost > 0 ? conversionValue / cost : 0;
      const aov = conversions > 0 ? conversionValue / conversions : 0;
      
      // Add all variables and calculated metrics to a new row
      const newRow = [searchTerm, campaignName, impressions, clicks, cost, conversions, conversionValue, cpc, ctr, convRate, cpa, roas, aov];
      
      // Add new row to the data array
      data.push(newRow);
    } catch (e) {
      Logger.log("Error processing row: " + e);
    }
  }
  
  return data;
}