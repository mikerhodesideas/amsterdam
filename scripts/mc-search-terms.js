const SHEET_URL = ''; // Create new sheet if not provided
const TAB = 'SearchTerms';

const QUERY = `
SELECT 
  search_term_view.search_term, 
  campaign.name,
  metrics.impressions, 
  metrics.clicks, 
  metrics.cost_micros, 
  metrics.conversions, 
  metrics.conversions_value,
  metrics.conversions_value_per_conversion,
  metrics.conversions_value_per_click,
  metrics.conversions_value_per_impression,
  metrics.conversions_value_per_thousand_impressions,
  metrics.conversions_value_per_thousand_clicks,
  metrics.conversions_value_per_thousand_impressions,
  metrics.conversions_value_per_thousand_clicks,
  metrics.conversions_value_per_thousand_impressions,
FROM search_term_view
WHERE segments.date DURING LAST_30_DAYS
  AND campaign.advertising_channel_type = "SEARCH"
  AND metrics.impressions > 10
ORDER BY metrics.impressions DESC
`;

function main() {
    try {
        let ss = SHEET_URL
            ? SpreadsheetApp.openByUrl(SHEET_URL)
            : SpreadsheetApp.create("Search Term Report");

        if (!SHEET_URL) {
            Logger.log("No SHEET_URL found, so this sheet was created: " + ss.getUrl());
        }

        let sheet;
        try {
            sheet = ss.getSheetByName(TAB) || ss.insertSheet(TAB);
            sheet.clearContents();
        } catch (e) {
            Logger.log("Error with sheet: " + e);
            return;
        }

        const headers = ["Search Term", "Campaign", "Impr", "Clicks", "Cost", "Conv", "Value", "CPC", "CTR", "CvR", "CPA", "ROAS"];
        const report = AdsApp.report(QUERY);
        const data = calculateMetrics(report.rows());

        if (data.length > 0) {
            const allData = [headers, ...data];
            sheet.getRange(1, 1, allData.length, allData[0].length).setValues(allData);
            Logger.log("Successfully wrote " + data.length + " rows to the sheet.");
        } else {
            Logger.log("No data found for the specified criteria.");
        }
    } catch (e) {
        Logger.log("Error in main function: " + e);
    }
}

function calculateMetrics(rows) {
    const data = [];

    while (rows.hasNext()) {
        const row = rows.next();

        const searchTerm = row['search_term_view.search_term'];
        const campaign = row['campaign.name'];
        const impr = parseInt(row['metrics.impressions'], 10) || 0;
        const clicks = parseInt(row['metrics.clicks'], 10) || 0;
        const costMicros = parseInt(row['metrics.cost_micros'], 10) || 0;
        const conv = parseFloat(row['metrics.conversions']) || 0;
        const value = parseFloat(row['metrics.conversions_value']) || 0;

        const cost = costMicros / 1000000;
        const cpc  = clicks > 0 ? cost / clicks : 0;
        const ctr  = impr   > 0 ? clicks / impr : 0;
        const cvr  = clicks > 0 ? conv / clicks : 0;
        const cpa  = conv   > 0 ? cost / conv : 0;
        const roas = cost   > 0 ? value / cost : 0;

        data.push([searchTerm, campaign, impr, clicks, cost, conv, value, cpc, ctr, cvr, cpa, roas]);
    }

    return data;
}