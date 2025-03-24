/**
 * Google Ads Negative Keywords Extraction Script
 * 
 * This script extracts all negative keywords from your Google Ads account:
 * - Campaign level negative keywords
 * - Ad group level negative keywords
 * - Shared negative keyword lists
 * 
 * The script outputs all data to a Google Sheet and provides basic statistics.
 * Mike's output sheet: 
 * https://docs.google.com/spreadsheets/d/1aEOcIYZ0pZN85yfJftN2AtzI_0Hrx23iGuYJpFoj1HQ/edit?usp=sharing
 * 
 */


const SHEET_URL = ''; // Create new sheet if not provided
const TAB_CAMPAIGN_NEGATIVES = 'Campaign Negatives';
const TAB_ADGROUP_NEGATIVES = 'Ad Group Negatives';
const TAB_SHARED_LISTS = 'Shared Neg. Lists';
const TAB_SHARED_NEGATIVES = 'Shared Neg. Keywords';
const TAB_STATS = 'Negative Stats';

function main() {
  // Create a new spreadsheet if none is provided
  if (!SHEET_URL) {
    let ss;
    try {
      ss = SpreadsheetApp.create("Google Ads Negative Keywords Report");
      let url = ss.getUrl();
      Logger.log("New spreadsheet created: " + url);
    } catch (e) {
      Logger.log("Error creating spreadsheet: " + e);
      return;
    }
  } else {
    ss = SpreadsheetApp.openByUrl(SHEET_URL);
  }


  // Clear and prepare sheets
  prepareSheets(ss);

  // Get and write campaign-level negative keywords
  const campaignNegatives = getCampaignNegativeKeywords();
  writeCampaignNegatives(ss, campaignNegatives);

  // Get and write ad group-level negative keywords
  const adGroupNegatives = getAdGroupNegativeKeywords();
  writeAdGroupNegatives(ss, adGroupNegatives);

  // Get and write shared negative keyword lists
  const { sharedLists, sharedKeywords } = getSharedNegativeKeywords();
  writeSharedLists(ss, sharedLists);
  writeSharedKeywords(ss, sharedKeywords);

  // Calculate and write statistics
  const stats = calculateNegativeStats(campaignNegatives, adGroupNegatives, sharedLists, sharedKeywords);
  writeNegativeStats(ss, stats);

  Logger.log("Negative keywords extraction completed.");
}

function prepareSheets(ss) {
  // Create or clear sheets for each tab
  const tabNames = [
    TAB_CAMPAIGN_NEGATIVES,
    TAB_ADGROUP_NEGATIVES,
    TAB_SHARED_LISTS,
    TAB_SHARED_NEGATIVES,
    TAB_STATS
  ];

  // Delete all sheets except the first one
  const sheets = ss.getSheets();
  for (let i = 1; i < sheets.length; i++) {
    ss.deleteSheet(sheets[i]);
  }

  // Rename first sheet and create others
  sheets[0].setName(tabNames[0]);
  for (let i = 1; i < tabNames.length; i++) {
    ss.insertSheet(tabNames[i]);
  }
}

function getCampaignNegativeKeywords() {
  // Query to retrieve campaign-level negative keywords using GAQL
  const campaignNegativeQuery = `
  SELECT
    campaign.id,
    campaign.name,
    campaign.status,
    campaign_criterion.keyword.text,
    campaign_criterion.keyword.match_type,
    campaign_criterion.negative,
    campaign_criterion.type,
    campaign_criterion.status
  FROM campaign_criterion
  WHERE
    campaign_criterion.negative = TRUE AND
    campaign_criterion.type = 'KEYWORD'
  ORDER BY campaign.name ASC
  `;

  // Execute the query and process results
  const campaignNegativeIterator = AdsApp.search(campaignNegativeQuery);

  const negativeKeywords = [];
  while (campaignNegativeIterator.hasNext()) {
    const row = campaignNegativeIterator.next();

    // Extract the values from the row
    try {
      negativeKeywords.push({
        campaignId: row.campaign.id,
        campaignName: row.campaign.name,
        campaignStatus: row.campaign.status,
        keywordText: row.campaignCriterion.keyword.text,
        matchType: row.campaignCriterion.keyword.matchType,
        status: row.campaignCriterion.status
      });
    } catch (e) {
      Logger.log("Error processing campaign negative keyword: " + e);
    }
  }

  return negativeKeywords;
}

function getAdGroupNegativeKeywords() {
  // Query to retrieve ad group-level negative keywords using GAQL
  const adGroupNegativeQuery = `
  SELECT
    campaign.id,
    campaign.name,
    ad_group.id,
    ad_group.name,
    ad_group_criterion.keyword.text,
    ad_group_criterion.keyword.match_type,
    ad_group_criterion.negative,
    ad_group_criterion.type,
    ad_group_criterion.status
  FROM ad_group_criterion
  WHERE
    ad_group_criterion.negative = TRUE AND
    ad_group_criterion.type = 'KEYWORD'
  ORDER BY campaign.name ASC, ad_group.name ASC
  `;

  // Execute the query and process results
  const adGroupNegativeIterator = AdsApp.search(adGroupNegativeQuery);

  const negativeKeywords = [];
  while (adGroupNegativeIterator.hasNext()) {
    const row = adGroupNegativeIterator.next();

    // Extract the values from the row
    try {
      negativeKeywords.push({
        campaignId: row.campaign.id,
        campaignName: row.campaign.name,
        adGroupId: row.adGroup.id,
        adGroupName: row.adGroup.name,
        keywordText: row.adGroupCriterion.keyword.text,
        matchType: row.adGroupCriterion.keyword.matchType,
        status: row.adGroupCriterion.status
      });
    } catch (e) {
      Logger.log("Error processing ad group negative keyword: " + e);
    }
  }

  return negativeKeywords;
}

function getSharedNegativeKeywords() {
  // Get all shared negative keyword lists
  const sharedSets = AdsApp.negativeKeywordLists().get();

  const sharedLists = [];
  const sharedKeywords = [];

  while (sharedSets.hasNext()) {
    const sharedSet = sharedSets.next();
    const sharedSetId = sharedSet.getId();
    const sharedSetName = sharedSet.getName();

    // Get all campaigns that use this shared set
    const campaignsWithList = [];
    const campaignIterator = sharedSet.campaigns().get();

    while (campaignIterator.hasNext()) {
      const campaign = campaignIterator.next();
      campaignsWithList.push({
        campaignId: campaign.getId(),
        campaignName: campaign.getName()
      });
    }

    // Add the shared list to our results
    sharedLists.push({
      listId: sharedSetId,
      listName: sharedSetName,
      campaignCount: campaignsWithList.length,
      campaigns: campaignsWithList
    });

    // Get all negative keywords in this shared list
    const negKeywordIterator = sharedSet.negativeKeywords().get();

    while (negKeywordIterator.hasNext()) {
      const negKeyword = negKeywordIterator.next();
      sharedKeywords.push({
        listId: sharedSetId,
        listName: sharedSetName,
        keywordText: negKeyword.getText(),
        matchType: negKeyword.getMatchType()
      });
    }
  }

  return { sharedLists, sharedKeywords };
}

function writeCampaignNegatives(ss, campaignNegatives) {
  const sheet = ss.getSheetByName(TAB_CAMPAIGN_NEGATIVES);

  // Write headers
  const headers = [
    'Campaign ID',
    'Campaign Name',
    'Campaign Status',
    'Negative Keyword',
    'Match Type',
    'Status'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Write data
  if (campaignNegatives.length > 0) {
    const rows = campaignNegatives.map(neg => [
      neg.campaignId,
      neg.campaignName,
      neg.campaignStatus,
      neg.keywordText,
      neg.matchType,
      neg.status
    ]);
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

function writeAdGroupNegatives(ss, adGroupNegatives) {
  const sheet = ss.getSheetByName(TAB_ADGROUP_NEGATIVES);

  // Write headers
  const headers = [
    'Campaign ID',
    'Campaign Name',
    'Ad Group ID',
    'Ad Group Name',
    'Negative Keyword',
    'Match Type',
    'Status'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Write data
  if (adGroupNegatives.length > 0) {
    const rows = adGroupNegatives.map(neg => [
      neg.campaignId,
      neg.campaignName,
      neg.adGroupId,
      neg.adGroupName,
      neg.keywordText,
      neg.matchType,
      neg.status
    ]);
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

function writeSharedLists(ss, sharedLists) {
  const sheet = ss.getSheetByName(TAB_SHARED_LISTS);

  // Write headers
  const headers = [
    'List ID',
    'List Name',
    'Campaign Count'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Write data
  if (sharedLists.length > 0) {
    const rows = sharedLists.map(list => [
      list.listId,
      list.listName,
      list.campaignCount
    ]);
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

function writeSharedKeywords(ss, sharedKeywords) {
  const sheet = ss.getSheetByName(TAB_SHARED_NEGATIVES);

  // Write headers
  const headers = [
    'List ID',
    'List Name',
    'Negative Keyword',
    'Match Type'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Write data
  if (sharedKeywords.length > 0) {
    const rows = sharedKeywords.map(neg => [
      neg.listId,
      neg.listName,
      neg.keywordText,
      neg.matchType
    ]);
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

function calculateNegativeStats(campaignNegatives, adGroupNegatives, sharedLists, sharedKeywords) {
  // Calculate campaign-level stats
  const campaignStats = {
    totalKeywords: campaignNegatives.length,
    exactCount: campaignNegatives.filter(n => n.matchType === 'EXACT').length,
    phraseCount: campaignNegatives.filter(n => n.matchType === 'PHRASE').length,
    broadCount: campaignNegatives.filter(n => n.matchType === 'BROAD').length
  };

  // Calculate ad group-level stats
  const adGroupStats = {
    totalKeywords: adGroupNegatives.length,
    exactCount: adGroupNegatives.filter(n => n.matchType === 'EXACT').length,
    phraseCount: adGroupNegatives.filter(n => n.matchType === 'PHRASE').length,
    broadCount: adGroupNegatives.filter(n => n.matchType === 'BROAD').length
  };

  // Calculate shared list stats
  const sharedListStats = {
    totalLists: sharedLists.length,
    totalKeywords: sharedKeywords.length,
    exactCount: sharedKeywords.filter(n => n.matchType === 'EXACT').length,
    phraseCount: sharedKeywords.filter(n => n.matchType === 'PHRASE').length,
    broadCount: sharedKeywords.filter(n => n.matchType === 'BROAD').length
  };

  // Count number of campaigns using each match type
  const campaignsUsingExact = new Set(campaignNegatives.filter(n => n.matchType === 'EXACT').map(n => n.campaignId)).size;
  const campaignsUsingPhrase = new Set(campaignNegatives.filter(n => n.matchType === 'PHRASE').map(n => n.campaignId)).size;
  const campaignsUsingBroad = new Set(campaignNegatives.filter(n => n.matchType === 'BROAD').map(n => n.campaignId)).size;

  // Count campaigns with any negative keywords
  const campaignsWithNegatives = new Set(campaignNegatives.map(n => n.campaignId)).size;

  // Get total number of campaigns
  const campaignQuery = `
  SELECT
    campaign.id
  FROM campaign
  `;

  const campaignIterator = AdsApp.search(campaignQuery);
  let totalCampaignCount = 0;
  while (campaignIterator.hasNext()) {
    campaignIterator.next();
    totalCampaignCount++;
  }

  // Calculate overall stats
  const totalNegatives = campaignStats.totalKeywords + adGroupStats.totalKeywords + sharedListStats.totalKeywords;

  return {
    totalCampaigns: totalCampaignCount,
    campaignsWithNegatives,
    campaignsUsingExact,
    campaignsUsingPhrase,
    campaignsUsingBroad,
    campaignStats,
    adGroupStats,
    sharedListStats,
    totalNegatives
  };
}

function writeNegativeStats(ss, stats) {
  const sheet = ss.getSheetByName(TAB_STATS);

  // Prepare data rows
  const data = [
    ['ACCOUNT OVERVIEW', ''],
    ['Total Campaigns', stats.totalCampaigns],
    ['Campaigns With Negative Keywords', stats.campaignsWithNegatives],
    ['Campaigns Using Exact Match Negatives', stats.campaignsUsingExact],
    ['Campaigns Using Phrase Match Negatives', stats.campaignsUsingPhrase],
    ['Campaigns Using Broad Match Negatives', stats.campaignsUsingBroad],
    ['', ''],
    ['NEGATIVE KEYWORD COUNTS', ''],
    ['Total Negative Keywords', stats.totalNegatives],
    ['', ''],
    ['CAMPAIGN-LEVEL NEGATIVES', ''],
    ['Total Keywords', stats.campaignStats.totalKeywords],
    ['Exact Match', stats.campaignStats.exactCount],
    ['Phrase Match', stats.campaignStats.phraseCount],
    ['Broad Match', stats.campaignStats.broadCount],
    ['', ''],
    ['AD GROUP-LEVEL NEGATIVES', ''],
    ['Total Keywords', stats.adGroupStats.totalKeywords],
    ['Exact Match', stats.adGroupStats.exactCount],
    ['Phrase Match', stats.adGroupStats.phraseCount],
    ['Broad Match', stats.adGroupStats.broadCount],
    ['', ''],
    ['SHARED NEGATIVE LISTS', ''],
    ['Total Lists', stats.sharedListStats.totalLists],
    ['Total Keywords', stats.sharedListStats.totalKeywords],
    ['Exact Match', stats.sharedListStats.exactCount],
    ['Phrase Match', stats.sharedListStats.phraseCount],
    ['Broad Match', stats.sharedListStats.broadCount]
  ];

  // Write data
  sheet.getRange(1, 1, data.length, 2).setValues(data);

  // Format headers and sections
  const sectionRows = [0, 7, 10, 15, 20];
  for (const row of sectionRows) {
    if (row < data.length) {
      sheet.getRange(row + 1, 1, 1, 2).setFontWeight('bold');
    }
  }

  // Auto-resize columns
  sheet.autoResizeColumn(1);
  sheet.autoResizeColumn(2);
}