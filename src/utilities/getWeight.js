
/**
 * 
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * 
 * @example
 * getWeight(20, 0, 100); // 0.2
 * getWeight(200, 0, 100); // 2
 * getWeight(50, 75, 100); // -1
 * 
 */
const getWeight = (value, min, max) => (value - min) / (max - min)

export default getWeight;