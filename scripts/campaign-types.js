/**
 * Campaign Types Performance Analysis
 * 
 * This script retrieves all campaign types in the account and their performance metrics
 * and exports the data to a Google Sheet.
 */

const SHEET_URL = ''; // Create new sheet if not provided
const CAMPAIGNS_TAB = 'Campaigns';
const CAMPAIGN_TYPES_TAB = 'Campaign Types';

const QUERY = `
SELECT 
  campaign.advertising_channel_type,
  campaign.name,
  campaign.status,
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
      ss = SpreadsheetApp.create("Campaign Types Analysis");
      let url = ss.getUrl();
      Logger.log("No SHEET_URL found, so this sheet was created: " + url);
    } else {
      ss = SpreadsheetApp.openByUrl(SHEET_URL);
    }
    
    // Get or create tabs
    let campaignsSheet = getOrCreateSheet(ss, CAMPAIGNS_TAB);
    let campaignTypesSheet = getOrCreateSheet(ss, CAMPAIGN_TYPES_TAB);
    
    // Execute query
    let rows = AdsApp.search(QUERY);
    
    if (rows.hasNext()) {
      // Process campaign-level data
      const campaignData = calculateMetrics(rows);
      
      // Reset iterator for campaign types aggregation
      rows = AdsApp.search(QUERY);
      const campaignTypeData = aggregateByCampaignType(rows);
      
      // Write campaign-level data
      const campaignHeaders = [
        'Campaign Type', 'Campaign Name', 'Status', 
        'Impressions', 'Clicks', 'Cost', 
        'Conversions', 'Conversion Value',
        'CTR', 'CPC', 'Conv. Rate', 'CPA', 'ROAS'
      ];
      
      if (campaignData.length > 0) {
        campaignsSheet.getRange(1, 1, 1, campaignHeaders.length).setValues([campaignHeaders]);
        campaignsSheet.getRange(2, 1, campaignData.length, campaignData[0].length).setValues(campaignData);
        Logger.log(`Exported ${campaignData.length} rows of campaign data to the sheet.`);
      }
      
      // Write campaign type aggregated data
      const campaignTypeHeaders = [
        'Campaign Type',
        'Impressions', 'Clicks', 'Cost', 
        'Conversions', 'Conversion Value',
        'CTR', 'CPC', 'Conv. Rate', 'CPA', 'ROAS'
      ];
      
      if (campaignTypeData.length > 0) {
        campaignTypesSheet.getRange(1, 1, 1, campaignTypeHeaders.length).setValues([campaignTypeHeaders]);
        campaignTypesSheet.getRange(2, 1, campaignTypeData.length, campaignTypeData[0].length).setValues(campaignTypeData);
        Logger.log(`Exported ${campaignTypeData.length} rows of campaign type data to the sheet.`);
      }
    } else {
      Logger.log("No data returned from query.");
      campaignsSheet.getRange(1, 1).setValue("No data returned from query.");
      campaignTypesSheet.getRange(1, 1).setValue("No data returned from query.");
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

function calculateMetrics(rows) {
  const data = [];
  let rowCount = 0;
  
  while (rows.hasNext()) {
    try {
      const row = rows.next();
      
      // Only log first 2 rows for debugging
      if (rowCount < 2) {
        Logger.log(`Row ${rowCount + 1} data: ${JSON.stringify(row)}`);
      }
      
      // Access nested objects correctly with proper property names
      const channelType = row.campaign.advertisingChannelType || '';
      const campaignName = row.campaign.name || '';
      const status = row.campaign.status || '';
      
      // Access metrics correctly
      const impressions = Number(row.metrics.impressions) || 0;
      const clicks = Number(row.metrics.clicks) || 0;
      const costMicros = Number(row.metrics.costMicros) || 0;
      const conversions = Number(row.metrics.conversions) || 0;
      const conversionValue = Number(row.metrics.conversionsValue) || 0;
      
      // Calculate derived metrics
      const cost = costMicros / 1000000;  // Convert micros to actual currency
      const ctr = impressions > 0 ? clicks / impressions : 0;
      const cpc = clicks > 0 ? cost / clicks : 0;
      const convRate = clicks > 0 ? conversions / clicks : 0;
      const cpa = conversions > 0 ? cost / conversions : 0;
      const roas = cost > 0 ? conversionValue / cost : 0;
      
      // Add row to data array & format numbers
      data.push([
        channelType,
        campaignName,
        status,
        impressions,
        clicks,
        cost.toFixed(2),
        conversions.toFixed(2),
        conversionValue.toFixed(2),
        (ctr * 100).toFixed(2) + '%',
        cpc.toFixed(2),
        (convRate * 100).toFixed(2) + '%',
        cpa.toFixed(2),
        roas.toFixed(2)
      ]);
      
      rowCount++;
    } catch (e) {
      Logger.log("Error processing row: " + e);
      // Continue with next row
    }
  }
  
  return data;
}

function aggregateByCampaignType(rows) {
  const aggregatedData = {};
  
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
      Logger.log("Error processing row: " + e);
    }
  }
  
  // Convert aggregated data to array format
  return Object.entries(aggregatedData).map(([channelType, metrics]) => {
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
}