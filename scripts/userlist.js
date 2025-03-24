function main() {
    const SHEET_URL = ''; // Create new sheet if not provided
    const spreadsheet = SpreadsheetApp.openByUrl(SHEET_URL);
  
    const queries = {
      userlist: `
      SELECT 
          user_list.access_reason, 
          user_list.account_user_list_status, 
          user_list.crm_based_user_list.data_source_type, 
          user_list.crm_based_user_list.upload_key_type, 
          user_list.description, 
          user_list.eligible_for_display, 
          user_list.eligible_for_search, 
          user_list.id, 
          user_list.integration_code, 
          user_list.match_rate_percentage, 
          user_list.membership_life_span, 
          user_list.membership_status, 
          user_list.name, 
          user_list.read_only, 
          user_list.resource_name, 
          user_list.rule_based_user_list.flexible_rule_user_list.inclusive_operands, 
          user_list.rule_based_user_list.flexible_rule_user_list.inclusive_rule_operator, 
          user_list.rule_based_user_list.prepopulation_status, 
          user_list.similar_user_list.seed_user_list, 
          user_list.size_for_display, 
          user_list.size_for_search, 
          user_list.size_range_for_display, 
          user_list.size_range_for_search, 
          user_list.type 
      FROM user_list 
      `,
      userinterest: `
      SELECT 
        user_interest.availabilities, 
        user_interest.launched_to_all, 
        user_interest.name, 
        user_interest.resource_name, 
        user_interest.taxonomy_type, 
        user_interest.user_interest_id, 
        user_interest.user_interest_parent 
    FROM user_interest 
`
    };
  
    for (const [tabName, query] of Object.entries(queries)) {
      let sheet = spreadsheet.getSheetByName(tabName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(tabName);
      }
      const report = AdsApp.report(query);
      report.exportToSheet(sheet);
    }
  }