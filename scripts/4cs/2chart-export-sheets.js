// Script to export campaign data to Google Sheets using GAQL. See 8020agent.com for more

const SPREADSHEET_URL = ''; // Add your Google Sheet URL here or leave blank to create new

function main() {
  let sheet;
  
  try {
    // Check if URL is provided
    if (!SPREADSHEET_URL) {
      // Create new spreadsheet
      const newSpreadsheet = SpreadsheetApp.create('Google Ads Campaign Data ' + new Date().toISOString().split('T')[0]);
      sheet = newSpreadsheet.getActiveSheet();
      Logger.log(`Created new spreadsheet: ${newSpreadsheet.getUrl()}`);
    } else {
      // Use existing spreadsheet
      try {
        sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getActiveSheet();
      } catch (error) {
        throw new Error(`Could not open spreadsheet at ${SPREADSHEET_URL}. Error: ${error.message}`);
      }
    }
    
    // Clear existing data
    sheet.clear();
    
    // Add headers
    sheet.getRange(1, 1, 1, 7).setValues([[
      'Date', 'Campaign', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'Conv. Value'
    ]]);
    
    // Get campaign data using GAQL
    const query = AdsApp.report(
      `SELECT 
        segments.date,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE campaign.status = 'ENABLED'
      AND segments.date DURING LAST_30_DAYS`
    );
    
    const rows = query.rows();
    const data = [];
    
    while (rows.hasNext()) {
      const row = rows.next();
      data.push([
        row['segments.date'],
        row['campaign.name'],
        row['metrics.impressions'],
        row['metrics.clicks'],
        row['metrics.cost_micros'] / 1000000, // Convert micros to actual currency
        row['metrics.conversions'],
        row['metrics.conversions_value']
      ]);
    }
    
    // Write data to sheet
    if (data.length > 0) {
      sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    }
    
    const message = `Exported ${data.length} campaign rows to Google Sheets`;
    if (!SPREADSHEET_URL) {
      Logger.log(message + `\nSpreadsheet URL: ${sheet.getParent().getUrl()}`);
    } else {
      Logger.log(message);
    }
  } catch (error) {
    const errorMsg = `Error in campaign export script: ${error.message}`;
    Logger.log(errorMsg);
    throw new Error(errorMsg);
  }
} 