function calculateNFTCollectionRisk(collection) {
    // Normalizing function
    function normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    // Normalize values where necessary (scaling to 0-1)
    let UHP_Score = normalize(collection.UHP, 0, 100);
    let PLI_Score = 1 - normalize(collection.PLI, 0, 100); // Inverted as lower is better
    let VC90_Score = normalize(collection.VC90, -100, 100);
    let FPM90_Score = normalize(collection.FPM90, -100, 100);
    let SC90_Score = normalize(collection.SC90, -100, 100);
    let TE_Score = normalize(collection.TE, 1, 3);
    let MS_Score = normalize(collection.MS, 1, 3);
    let TC_Score = normalize(collection.TC, 1, 3);

    // Calculate the final score as an average of all scores
    let totalScore = (UHP_Score + PLI_Score + VC90_Score + FPM90_Score + SC90_Score + TE_Score + MS_Score + TC_Score) / 8;

    return (1 - totalScore) * 100;
}