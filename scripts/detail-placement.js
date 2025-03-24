const SHEET_URL = ''; // Create new sheet if not provided
const TAB = 'Detail Placements';

const QUERY = `
SELECT 
    detail_placement_view.resource_name,
    detail_placement_view.placement,
    campaign.name,
    metrics.impressions,
    metrics.clicks,
    metrics.cost_micros,
    metrics.conversions,
    metrics.conversions_value
FROM detail_placement_view
WHERE segments.date DURING LAST_30_DAYS
  AND metrics.impressions > 100
ORDER BY metrics.cost_micros DESC
`;

function main() {
    try {
        // Execute the GAQL query
        const rows = AdsApp.search(QUERY);

        // Log the total number of rows returned
        let rowCount = 0;
        const tempRows = AdsApp.search(QUERY);
        while (tempRows.hasNext()) {
            tempRows.next();
            rowCount++;
        }
        Logger.log(`Query returned ${rowCount} rows`);

        // Process data and calculate metrics
        const data = calculateMetrics(rows);

        // Handle spreadsheet
        let ss;
        if (!SHEET_URL) {
            ss = SpreadsheetApp.create("Google Ads Detail Placement Report");
            const url = ss.getUrl();
            Logger.log("No SHEET_URL provided. Created new spreadsheet: " + url);
        } else {
            ss = SpreadsheetApp.openByUrl(SHEET_URL);
        }

        // Create or clear the sheet
        let sheet;
        if (ss.getSheetByName(TAB)) {
            sheet = ss.getSheetByName(TAB);
            sheet.clear();
        } else {
            sheet = ss.insertSheet(TAB);
        }

        // Create headers
        const headers = [
            'Campaign', 'Placement', 'Impressions', 'Clicks', 'Cost',
            'Conversions', 'Conv. Value', 'CTR', 'CvR', 'CPA', 'ROAS', 'AOV'
        ];

        // Write headers and data to sheet in a single operation
        if (data.length > 0) {
            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
            sheet.getRange(2, 1, data.length, headers.length).setValues(data);
            Logger.log(`Successfully wrote ${data.length} rows of data to the spreadsheet.`);
        } else {
            Logger.log("No data to write to spreadsheet.");
            sheet.getRange(1, 1).setValue("No data found for the specified criteria.");
        }

    } catch (e) {
        Logger.log(`Error in main function: ${e}`);
    }
}

function calculateMetrics(rows) {
    const data = [];

    // Log first row structure to debug field access patterns
    if (rows.hasNext()) {
        const sampleRow = rows.next();
        Logger.log("Sample row structure for debugging:");
        for (const key in sampleRow) {
            Logger.log(`${key}: ${sampleRow[key]}`);
        }

        // Reset iterator by creating a new one
        rows = AdsApp.search(QUERY);
    }

    while (rows.hasNext()) {
        try {
            const row = rows.next();

            // Access dimensions using bracket notation with full paths
            const campaignName = row['campaign.name'] || '';
            const placement = row['detail_placement_view.placement'] || '';

            // ALWAYS convert metrics to numbers and handle null/undefined
            const impressions = Number(row['metrics.impressions']) || 0;
            const clicks = Number(row['metrics.clicks']) || 0;
            const costMicros = Number(row['metrics.cost_micros']) || 0;
            const conversions = Number(row['metrics.conversions']) || 0;
            const conversionValue = Number(row['metrics.conversions_value']) || 0;

            // Calculate metrics
            const cost = costMicros / 1000000;  // Convert micros to actual currency
            const ctr = impressions > 0 ? clicks / impressions : 0;
            const cvr = clicks > 0 ? conversions / clicks : 0;
            const cpa = conversions > 0 ? cost / conversions : 0;
            const roas = cost > 0 ? conversionValue / cost : 0;
            const aov = conversions > 0 ? conversionValue / conversions : 0;

            // Add all variables and calculated metrics to a new row
            const newRow = [
                campaignName, placement, impressions, clicks, cost,
                conversions, conversionValue, ctr, cvr, cpa, roas, aov
            ];

            data.push(newRow);
        } catch (e) {
            Logger.log("Error processing row: " + e);
            // Continue with next row
        }
    }

    return data;
}
