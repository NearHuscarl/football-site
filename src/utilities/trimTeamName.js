/**
 * @param {string} teamName 
 * 
 * Remove common suffix and preffix (FC, CF, AFC)
 * 
 * e.g. `'Liverpool FC'` => `'Liverpool'`
 */
const removedRegex = /\s*(FC|CF|AFC)\s*/i;
const trimTeamName = (teamName) => teamName.replace(removedRegex, '')

export default trimTeamName;