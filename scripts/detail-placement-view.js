/**
 * Enhanced Placement Analysis Script
 * 
 * Provides multiple views of placement data with different levels of aggregation:
 * 1. Detailed View: All individual placements
 * 2. By Placement Type: Aggregated data for each placement type
 * 3. By Campaign Type: Aggregated data for each campaign type
 * 4. By Campaign & Placement Type: Data for each placement type within each campaign
 * 
 * To use:
 * 1. Copy this script to Google Ads Scripts
 * 2. (Optional) Adjust the constants below
 * 3. Run the script
 */

// User-configurable constants
const SHEET_URL = ''; // Create new sheet if not provided
const DATE_RANGE = 'LAST_30_DAYS'; // Options: 'LAST_7_DAYS', 'LAST_14_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', etc.
const MIN_IMPRESSIONS = 100; // Only include placements with at least this many impressions

// Tab names
const TABS = {
  DETAILED: 'Detailed Placements',
  BY_PLACEMENT_TYPE: 'By Placement Type',
  BY_CAMPAIGN_TYPE: 'By Campaign Type',
  BY_CAMPAIGN_AND_PLACEMENT: 'By Campaign & Placement Type'
};

// Main query for fetching placement data
const QUERY = `
SELECT 
  campaign.name,
  campaign.advertising_channel_type,
  detail_placement_view.display_name,
  detail_placement_view.placement,
  detail_placement_view.placement_type,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM detail_placement_view
WHERE segments.date DURING ${DATE_RANGE}
  AND metrics.impressions >= ${MIN_IMPRESSIONS}
ORDER BY metrics.cost_micros DESC
`;

function main() {
  try {
    // Initialize spreadsheet
    const ss = initializeSpreadsheet();
    if (!ss) return;

    // Create tabs
    const sheets = {
      detailed: getOrCreateSheet(ss, TABS.DETAILED),
      byPlacementType: getOrCreateSheet(ss, TABS.BY_PLACEMENT_TYPE),
      byCampaignType: getOrCreateSheet(ss, TABS.BY_CAMPAIGN_TYPE),
      byCampaignAndPlacement: getOrCreateSheet(ss, TABS.BY_CAMPAIGN_AND_PLACEMENT)
    };

    // Fetch data
    const rows = AdsApp.search(QUERY);
    if (!rows.hasNext()) {
      Logger.log("No data returned from query.");
      sheets.detailed.getRange(1, 1).setValue("No placement data found that meets the minimum impressions criteria.");
      return;
    }

    // Process all rows into a simple array
    const allPlacements = [];
    while (rows.hasNext()) {
      const row = rows.next();
      allPlacements.push({
        campaign: row.campaign.name || '',
        campaignType: row.campaign.advertisingChannelType || '',
        placementName: row.detailPlacementView.displayName || '',
        placementUrl: row.detailPlacementView.placement || '',
        placementType: row.detailPlacementView.placementType || '',
        impressions: Number(row.metrics.impressions) || 0,
        clicks: Number(row.metrics.clicks) || 0,
        cost: (Number(row.metrics.costMicros) || 0) / 1000000,
        conversions: Number(row.metrics.conversions) || 0
      });
    }

    // Process and output each report format
    processDetailedView(sheets.detailed, allPlacements);
    processPlacementTypeView(sheets.byPlacementType, allPlacements);
    processCampaignTypeView(sheets.byCampaignType, allPlacements);
    processCampaignAndPlacementView(sheets.byCampaignAndPlacement, allPlacements);

    Logger.log(`Successfully processed ${allPlacements.length} placements with ${MIN_IMPRESSIONS}+ impressions`);

  } catch (e) {
    Logger.log("Error in script: " + e);
  }
}

function initializeSpreadsheet() {
  try {
    let ss;
    if (!SHEET_URL) {
      ss = SpreadsheetApp.create("Enhanced Placement Analysis");
      Logger.log("Created new spreadsheet: " + ss.getUrl());
    } else {
      ss = SpreadsheetApp.openByUrl(SHEET_URL);
      Logger.log("Opened existing spreadsheet");
    }
    return ss;
  } catch (e) {
    Logger.log("Error initializing spreadsheet: " + e);
    return null;
  }
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();
  return sheet;
}

// Process and output detailed placement view
function processDetailedView(sheet, allPlacements) {
  // Define headers
  const headers = [
    'Campaign',
    'Campaign Type',
    'Placement Name',
    'Placement URL',
    'Placement Type',
    'Impressions',
    'Clicks',
    'Cost',
    'CTR',
    'Conversions'
  ];

  // Format data rows
  const rows = allPlacements.map(item => {
    const ctr = item.impressions > 0 ? item.clicks / item.impressions : 0;

    return [
      item.campaign,
      item.campaignType,
      item.placementName,
      item.placementUrl,
      item.placementType,
      item.impressions,
      item.clicks,
      item.cost.toFixed(2),
      (ctr * 100).toFixed(2) + '%',
      item.conversions.toFixed(2)
    ];
  });

  // Write data - No summary row for detailed view
  writeDataToSheet(sheet, headers, rows);
}

// Process and output placement type view
function processPlacementTypeView(sheet, allPlacements) {
  // Group data by placement type
  const byPlacementType = {};

  allPlacements.forEach(item => {
    const type = item.placementType || 'Unknown';
    if (!byPlacementType[type]) {
      byPlacementType[type] = {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0
      };
    }

    byPlacementType[type].impressions += item.impressions;
    byPlacementType[type].clicks += item.clicks;
    byPlacementType[type].cost += item.cost;
    byPlacementType[type].conversions += item.conversions;
  });

  // Convert to array and calculate metrics
  const data = Object.entries(byPlacementType).map(([type, metrics]) => {
    const ctr = metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0;
    const cpc = metrics.clicks > 0 ? metrics.cost / metrics.clicks : 0;
    const convRate = metrics.clicks > 0 ? metrics.conversions / metrics.clicks : 0;
    const costPerConv = metrics.conversions > 0 ? metrics.cost / metrics.conversions : 0;

    return [
      type,
      metrics.impressions,
      metrics.clicks,
      metrics.cost.toFixed(2),
      (ctr * 100).toFixed(2) + '%',
      cpc.toFixed(2),
      metrics.conversions.toFixed(2),
      (convRate * 100).toFixed(2) + '%',
      metrics.conversions > 0 ? costPerConv.toFixed(2) : '-'
    ];
  });

  // Define headers
  const headers = [
    'Placement Type',
    'Impressions',
    'Clicks',
    'Cost',
    'CTR',
    'CPC',
    'Conversions',
    'Conv. Rate',
    'Cost per Conv.'
  ];

  // Write data
  writeDataToSheet(sheet, headers, data);

  // Add summary row
  const totals = calculateTotals(allPlacements);
  const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
  const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
  const convRate = totals.clicks > 0 ? totals.conversions / totals.clicks : 0;
  const costPerConv = totals.conversions > 0 ? totals.cost / totals.conversions : 0;

  const summaryRow = [
    'TOTAL',
    totals.impressions,
    totals.clicks,
    totals.cost.toFixed(2),
    (ctr * 100).toFixed(2) + '%',
    cpc.toFixed(2),
    totals.conversions.toFixed(2),
    (convRate * 100).toFixed(2) + '%',
    totals.conversions > 0 ? costPerConv.toFixed(2) : '-'
  ];

  addSummaryRowToSheet(sheet, summaryRow);
}

// Process and output campaign type view
function processCampaignTypeView(sheet, allPlacements) {
  // Group data by campaign type
  const byCampaignType = {};

  allPlacements.forEach(item => {
    const type = item.campaignType || 'Unknown';
    if (!byCampaignType[type]) {
      byCampaignType[type] = {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0
      };
    }

    byCampaignType[type].impressions += item.impressions;
    byCampaignType[type].clicks += item.clicks;
    byCampaignType[type].cost += item.cost;
    byCampaignType[type].conversions += item.conversions;
  });

  // Convert to array and calculate metrics
  const data = Object.entries(byCampaignType).map(([type, metrics]) => {
    const ctr = metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0;
    const cpc = metrics.clicks > 0 ? metrics.cost / metrics.clicks : 0;
    const convRate = metrics.clicks > 0 ? metrics.conversions / metrics.clicks : 0;
    const costPerConv = metrics.conversions > 0 ? metrics.cost / metrics.conversions : 0;

    return [
      type,
      metrics.impressions,
      metrics.clicks,
      metrics.cost.toFixed(2),
      (ctr * 100).toFixed(2) + '%',
      cpc.toFixed(2),
      metrics.conversions.toFixed(2),
      (convRate * 100).toFixed(2) + '%',
      metrics.conversions > 0 ? costPerConv.toFixed(2) : '-'
    ];
  });

  // Define headers
  const headers = [
    'Campaign Type',
    'Impressions',
    'Clicks',
    'Cost',
    'CTR',
    'CPC',
    'Conversions',
    'Conv. Rate',
    'Cost per Conv.'
  ];

  // Write data
  writeDataToSheet(sheet, headers, data);

  // Add summary row
  const totals = calculateTotals(allPlacements);
  const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
  const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
  const convRate = totals.clicks > 0 ? totals.conversions / totals.clicks : 0;
  const costPerConv = totals.conversions > 0 ? totals.cost / totals.conversions : 0;

  const summaryRow = [
    'TOTAL',
    totals.impressions,
    totals.clicks,
    totals.cost.toFixed(2),
    (ctr * 100).toFixed(2) + '%',
    cpc.toFixed(2),
    totals.conversions.toFixed(2),
    (convRate * 100).toFixed(2) + '%',
    totals.conversions > 0 ? costPerConv.toFixed(2) : '-'
  ];

  addSummaryRowToSheet(sheet, summaryRow);
}

// Process and output campaign and placement type view
function processCampaignAndPlacementView(sheet, allPlacements) {
  // Group data by campaign and placement type
  const byCampaignAndPlacement = {};

  allPlacements.forEach(item => {
    const key = `${item.campaign}|${item.placementType || 'Unknown'}`;
    if (!byCampaignAndPlacement[key]) {
      byCampaignAndPlacement[key] = {
        campaign: item.campaign,
        placementType: item.placementType || 'Unknown',
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0
      };
    }

    byCampaignAndPlacement[key].impressions += item.impressions;
    byCampaignAndPlacement[key].clicks += item.clicks;
    byCampaignAndPlacement[key].cost += item.cost;
    byCampaignAndPlacement[key].conversions += item.conversions;
  });

  // Convert to array and calculate metrics
  const data = Object.values(byCampaignAndPlacement).map(item => {
    const ctr = item.impressions > 0 ? item.clicks / item.impressions : 0;
    const cpc = item.clicks > 0 ? item.cost / item.clicks : 0;
    const convRate = item.clicks > 0 ? item.conversions / item.clicks : 0;
    const costPerConv = item.conversions > 0 ? item.cost / item.conversions : 0;

    return [
      item.campaign,
      item.placementType,
      item.impressions,
      item.clicks,
      item.cost.toFixed(2),
      (ctr * 100).toFixed(2) + '%',
      cpc.toFixed(2),
      item.conversions.toFixed(2),
      (convRate * 100).toFixed(2) + '%',
      item.conversions > 0 ? costPerConv.toFixed(2) : '-'
    ];
  }).sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));

  // Define headers
  const headers = [
    'Campaign',
    'Placement Type',
    'Impressions',
    'Clicks',
    'Cost',
    'CTR',
    'CPC',
    'Conversions',
    'Conv. Rate',
    'Cost per Conv.'
  ];

  // Write data
  writeDataToSheet(sheet, headers, data);

  // Add summary row
  const totals = calculateTotals(allPlacements);
  const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
  const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
  const convRate = totals.clicks > 0 ? totals.conversions / totals.clicks : 0;
  const costPerConv = totals.conversions > 0 ? totals.cost / totals.conversions : 0;

  const summaryRow = [
    'TOTAL', '',
    totals.impressions,
    totals.clicks,
    totals.cost.toFixed(2),
    (ctr * 100).toFixed(2) + '%',
    cpc.toFixed(2),
    totals.conversions.toFixed(2),
    (convRate * 100).toFixed(2) + '%',
    totals.conversions > 0 ? costPerConv.toFixed(2) : '-'
  ];

  addSummaryRowToSheet(sheet, summaryRow);
}

function calculateTotals(data) {
  return data.reduce((acc, item) => ({
    impressions: acc.impressions + item.impressions,
    clicks: acc.clicks + item.clicks,
    cost: acc.cost + item.cost,
    conversions: acc.conversions + item.conversions
  }), {
    impressions: 0,
    clicks: 0,
    cost: 0,
    conversions: 0
  });
}

function writeDataToSheet(sheet, headers, rows) {
  // Write headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Write data if available
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  } else {
    sheet.getRange(2, 1).setValue("No data available for this view.");
  }

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#f3f3f3');
  headerRange.setFontWeight('bold');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-size columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

function addSummaryRowToSheet(sheet, summaryRow) {
  // Add summary row to sheet
  const lastRow = sheet.getLastRow() + 1;
  sheet.getRange(lastRow, 1, 1, summaryRow.length).setValues([summaryRow]);

  // Format summary row
  sheet.getRange(lastRow, 1, 1, summaryRow.length).setBackground('#e6e6e6').setFontWeight('bold');
}