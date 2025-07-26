
export const distributePoints = (totalPoints: number, numBuckets: number): number[] => {
    if (numBuckets <= 0) return [];
    
    let points = totalPoints;
    const buckets = new Array(numBuckets).fill(0);
    
    while (points > 0) {
        const bucketIndex = Math.floor(Math.random() * numBuckets);
        buckets[bucketIndex]++;
        points--;
    }

    return buckets;
};
