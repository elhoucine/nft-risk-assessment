function calculateNormalizedPriceGap(floorPrice, offerPrice) {
    let rawGap = floorPrice - offerPrice;
    if (rawGap <= 0) {
        return 0; // Strong liquidity
    }
    let normalizedGap = (rawGap / floorPrice);
    return Math.min(normalizedGap, 1); // Clamp the value to a maximum of 1
}

function calculateNFTCollectionRisk(collection) {
    // Normalizing function for collection variables
    function normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    // Define initial weights in percentages
    let percentageWeights = {
        UHP: 12,   // Weight for Unique Holders Percentage: Indicates the diversity of ownership in the collection.
        PLI: 12,   // Weight for Percentage of Listed Items: Shows the proportion of items listed for sale, indicating market sentiment.
        VC90: 15,  // Weight for Volume Change in Last 90 Days: Reflects the change in trading volume, indicating market activity.
        FPM90: 10, // Weight for Floor Price Movement in Last 90 Days: Shows the change in the lowest price of the collection, indicating price stability.
        SC90: 15,  // Weight for Sales Change in Last 90 Days: Represents the change in the number of sales, indicating market demand.
        MS: 11,    // Weight for Market Sentiment: A subjective metric assessing overall market attitude towards the collection.
        TC: 12,    // Weight for Team Capital: Evaluates the financial strength and resource backing of the team behind the collection.
        CEA: 15,   // Weight for Community Engagement and Activity: Measures the level of community involvement and interaction.
        LG: 20     // Weight for Liquidity Gap: Assesses the gap between the floor price and the collection offer price, indicating liquidity.
    };

    // Normalize weights to sum up to 100
    let totalPercentage = Object.values(percentageWeights).reduce((sum, weight) => sum + weight);
    let normalizedWeights = {};
    for (let key in percentageWeights) {
        normalizedWeights[key] = percentageWeights[key] / totalPercentage;
    }

    // Calculate Liquidity Gap
    let liquidityGap = calculateNormalizedPriceGap(collection.floorPrice, collection.offerPrice);

    // Apply normalized weights to calculate the score
    let scores = {
        UHP: normalize(collection.UHP, 0, 100) * normalizedWeights.UHP,
        PLI: (1 - normalize(collection.PLI, 0, 100)) * normalizedWeights.PLI,
        VC90: normalize(collection.VC90, -100, 100) * normalizedWeights.VC90,
        FPM90: normalize(collection.FPM90, -100, 100) * normalizedWeights.FPM90,
        SC90: normalize(collection.SC90, -100, 100) * normalizedWeights.SC90,
        MS: normalize(collection.MS, 1, 3) * normalizedWeights.MS,
        TC: normalize(collection.TC, 1, 3) * normalizedWeights.TC,
        CEA: normalize(collection.CEA, 0, 100) * normalizedWeights.CEA,
        LG: liquidityGap * normalizedWeights.LG
    };

    // Calculate the final score
    let totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return Math.abs(totalScore - 1) * 100;
}
