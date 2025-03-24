// Script to pause campaigns that spent more than 2x their daily budget yesterday. See 8020agent.com for more
// Set this to true ONLY if you understand this script will pause campaigns
const I_UNDERSTAND_THIS_MAKES_CHANGES = false;

function main() {
    Logger.log(I_UNDERSTAND_THIS_MAKES_CHANGES ?
        '⚠️ LIVE MODE - WILL PAUSE CAMPAIGNS' :
        'PREVIEW MODE - NO CAMPAIGNS WILL BE PAUSED');
    Logger.log('------------------------');

    processAllCampaigns(true); // Always process campaigns, but in appropriate mode
}

function processAllCampaigns(isPreview) {
    try {
        let hasOverspendingCampaigns = false;

        // Handle regular campaigns
        const campaigns = AdsApp.campaigns()
            .withCondition('Status = ENABLED')
            .forDateRange('YESTERDAY')
            .get();

        if (campaigns.hasNext()) {
            hasOverspendingCampaigns = processCampaignIterator(campaigns, isPreview) || hasOverspendingCampaigns;
        } else {
            Logger.log('ℹ️ No regular campaigns found');
        }

        // Handle Performance Max campaigns
        const pmaxCampaigns = AdsApp.performanceMaxCampaigns()
            .withCondition('Status = ENABLED')
            .forDateRange('YESTERDAY')
            .get();

        if (pmaxCampaigns.hasNext()) {
            hasOverspendingCampaigns = processCampaignIterator(pmaxCampaigns, isPreview) || hasOverspendingCampaigns;
        } else {
            Logger.log('ℹ️ No Performance Max campaigns found');
        }

        if (!hasOverspendingCampaigns) {
            Logger.log('✅ No campaigns found that exceeded 2x daily budget');
        }

    } catch (e) {
        Logger.log('❌ Error: ' + e.toString());
    }
}

function processCampaignIterator(campaignIterator, isPreview) {
    let foundOverspending = false;

    while (campaignIterator.hasNext()) {
        try {
            const campaign = campaignIterator.next();
            const stats = campaign.getStatsFor('YESTERDAY');
            const budget = campaign.getBudget().getAmount();
            const spend = stats.getCost();
            const type = campaign.getAdvertisingChannelType ?
                campaign.getAdvertisingChannelType() :
                'PERFORMANCE_MAX';

            if (spend > budget * 2) {
                foundOverspending = true;
                if (isPreview) {
                    Logger.log('🔄 Campaign would be paused:');
                    Logger.log(`Name: ${campaign.getName()}`);
                    Logger.log(`Type: ${type}`);
                    Logger.log(`Daily Budget: ${budget}`);
                    Logger.log(`Actual Spend: ${spend}`);
                    Logger.log(`Overspend: ${(spend - budget).toFixed(2)} (${((spend / budget - 1) * 100).toFixed(1)}%)`);
                    Logger.log('------------------------');
                } else {
                    campaign.pause();
                    Logger.log('🛑 Paused campaign:');
                    Logger.log(`Name: ${campaign.getName()}`);
                    Logger.log(`Type: ${type}`);
                    Logger.log(`Daily Budget: ${budget}`);
                    Logger.log(`Actual Spend: ${spend}`);
                    Logger.log('------------------------');
                }
            }
        } catch (e) {
            Logger.log(`❌ Error processing campaign: ${e.toString()}`);
            continue;
        }
    }

    return foundOverspending;
} 