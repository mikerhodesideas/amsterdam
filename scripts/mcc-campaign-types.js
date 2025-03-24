/**
 * MCC Campaign Types Performance Analysis
 * 
 * This script retrieves campaign type performance metrics across all accounts in an MCC
 * and exports the aggregated data to a Google Sheet.
 */

const SHEET_URL = ''; // Create new sheet if not provided
const TAB = 'Campaign Types';

const QUERY = `
SELECT 
  campaign.advertising_channel_type,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions,
  metrics.conversions_value
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
ORDER BY metrics.cost_micros DESC
`;

function main() {
  try {
    // Create or open spreadsheet
    let ss;
    if (!SHEET_URL) {
      ss = SpreadsheetApp.create("MCC Campaign Types Analysis");
      let url = ss.getUrl();
      Logger.log("No SHEET_URL found, so this sheet was created: " + url);
    } else {
      ss = SpreadsheetApp.openByUrl(SHEET_URL);
    }
    
    // Get or create tab
    let sheet = getOrCreateSheet(ss, TAB);
    
    // Initialize aggregated data object
    const aggregatedData = {};
    
    // Get all accounts in MCC
    const accountSelector = MccApp.accounts();
    const accountIterator = accountSelector.get();
    
    // Process each account
    while (accountIterator.hasNext()) {
      const account = accountIterator.next();
      // Logger.log(`Processing account: ${account.getName()}`); // comment out if script runs too slowly
      
      // Switch to account context
      MccApp.select(account);
      
      // Execute query for this account
      const rows = AdsApp.search(QUERY);
      
      // Aggregate data from this account
      while (rows.hasNext()) {
        try {
          const row = rows.next();
          const channelType = row.campaign.advertisingChannelType || '';
          
          if (!aggregatedData[channelType]) {
            aggregatedData[channelType] = {
              impressions: 0,
              clicks: 0,
              costMicros: 0,
              conversions: 0,
              conversionValue: 0
            };
          }
          
          // Sum up metrics
          aggregatedData[channelType].impressions += Number(row.metrics.impressions) || 0;
          aggregatedData[channelType].clicks += Number(row.metrics.clicks) || 0;
          aggregatedData[channelType].costMicros += Number(row.metrics.costMicros) || 0;
          aggregatedData[channelType].conversions += Number(row.metrics.conversions) || 0;
          aggregatedData[channelType].conversionValue += Number(row.metrics.conversionsValue) || 0;
        } catch (e) {
          Logger.log(`Error processing row in account ${account.getName()}: ${e}`);
        }
      }
    }
    
    // Convert aggregated data to array format
    const data = Object.entries(aggregatedData).map(([channelType, metrics]) => {
      const cost = metrics.costMicros / 1000000;
      const ctr = metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0;
      const cpc = metrics.clicks > 0 ? cost / metrics.clicks : 0;
      const convRate = metrics.clicks > 0 ? metrics.conversions / metrics.clicks : 0;
      const cpa = metrics.conversions > 0 ? cost / metrics.conversions : 0;
      const roas = cost > 0 ? metrics.conversionValue / cost : 0;
      
      return [
        channelType,
        metrics.impressions,
        metrics.clicks,
        cost.toFixed(2),
        metrics.conversions.toFixed(2),
        metrics.conversionValue.toFixed(2),
        (ctr * 100).toFixed(2) + '%',
        cpc.toFixed(2),
        (convRate * 100).toFixed(2) + '%',
        cpa.toFixed(2),
        roas.toFixed(2)
      ];
    });
    
    // Sort data by cost (descending)
    data.sort((a, b) => parseFloat(b[3]) - parseFloat(a[3]));
    
    // Write headers and data
    const headers = [
      'Campaign Type',
      'Impressions', 'Clicks', 'Cost', 
      'Conversions', 'Conversion Value',
      'CTR', 'CPC', 'Conv. Rate', 'CPA', 'ROAS'
    ];
    
    if (data.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
      Logger.log(`Exported ${data.length} rows of MCC campaign type data to the sheet.`);
    } else {
      sheet.getRange(1, 1).setValue("No data found for the specified criteria.");
      Logger.log("No data found for the specified criteria.");
    }
    
  } catch (e) {
    Logger.log("Error in main function: " + e);
  }
}

function getOrCreateSheet(ss, tabName) {
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
  } else {
    sheet.clear();
  }
  return sheet;
} 