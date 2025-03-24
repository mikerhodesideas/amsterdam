function main() {
  const SHEET_URL = ''; // Add existing sheet URL if available, otherwise a new one will be created

  const query = `
    SELECT 
      video.id, 
      video.title, 
      metrics.conversions, 
      metrics.clicks, 
      metrics.impressions, 
      metrics.engagements
    FROM video 
    WHERE segments.date DURING LAST_30_DAYS
      AND metrics.cost_micros > 0
    ORDER BY metrics.impressions DESC
  `;

  // weirdly cost & video views aren't available via the script API !!!
  
  const adsQuery = AdsApp.search(query);
  const data = [];

  let sheet;
  if (SHEET_URL) {
    sheet = SpreadsheetApp.openByUrl(SHEET_URL).getActiveSheet();
  } else {
    const spreadsheet = SpreadsheetApp.create("Google Ads Videos Report");
    sheet = spreadsheet.getActiveSheet();
    Logger.log("Sheet created: " + spreadsheet.getUrl());
  }

  while (adsQuery.hasNext()) {
    const row = adsQuery.next();
    data.push([
      row.video.id,
      row.video.title,
      Number(row.metrics.impressions),
      Number(row.metrics.engagements), 
      Number(row.metrics.clicks),
      Number(row.metrics.conversions)
    ]);
  }

  const headers = ['Video ID', 'Title', 'Impr', 'Engagements', 'Clicks', 'Conv'];
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  }
}