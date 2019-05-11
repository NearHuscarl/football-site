import FootballData from 'footballdata-api-v2';
import { competitions } from '../settings';
import Log from "./log"
import { getTeamDetails as getSofifaTeams } from '../actions/teams';

/**
 * get a map of team ids between footballData and sofifa
 */
const mapTeamIds = (_footballDataTeams, _sofifaTeams) => {
	const footballDataTeams = [..._footballDataTeams];
	const sofifaTeams = [..._sofifaTeams];
	const maps = {};
	const normailizeWebsite = (website) => website.replace(/\/$/, '')
	const normalizeName = (teamName) => teamName.replace('-', ' '); // Handle edge case 'VVV-Venlo' => 'VVV Venlo'
	const normalizePhone = (phone) => (phone || '').replace(/\(0/, '(').replace(/\s+/g, ''); // '+49 (0211) 238 010' => '+49(211)238010'
	
	for (let i = 0; i < footballDataTeams.length; i+=1) {
		const footballDataTeam = footballDataTeams[i];

		for (let j = 0; j < sofifaTeams.length; j+=1) {
			const sofifaTeam = sofifaTeams[j];
			const sofifaName = normalizeName(sofifaTeam.name);
			const fdName = normalizeName(footballDataTeam.name);
			
			if (normailizeWebsite(sofifaTeam.contact.website) === normailizeWebsite(footballDataTeam.website)
				|| sofifaTeam.contact.email === footballDataTeam.email
				|| normalizePhone(sofifaTeam.contact.phone) === normalizePhone(footballDataTeam.phone)
				|| fdName.includes(sofifaName)) {
				maps[footballDataTeam.id] = sofifaTeam.id;
				footballDataTeams.splice(i, 1);
				i-=1;
				sofifaTeams.splice(j, 1);
				j-=1;
				break;
			}
		}
	}
	
	const untrackedSofifaTeams = {};
	sofifaTeams.forEach((team) => {
		if (!untrackedSofifaTeams[team.country]) untrackedSofifaTeams[team.country] = [];
		untrackedSofifaTeams[team.country].push(team);
	})
	const untrackedFDTeams = {};
	footballDataTeams.forEach((team) => {
		if (!untrackedFDTeams[team.area.name]) untrackedFDTeams[team.area.name] = [];
		untrackedFDTeams[team.area.name].push(team);
	})
	// eslint-disable-next-line no-console
	console.log('untrack football data teams', untrackedFDTeams);
	// eslint-disable-next-line no-console
	console.log('untrack sofifa teams', untrackedSofifaTeams);

	return maps;
}

export const getTeamIdMap = () => {
	const competitionIds = Object.keys(competitions);
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);
	const promises = [];

	promises.push(getSofifaTeams());
	competitionIds.forEach((competitionId) => {
		Log.warning(`start getting teams: competitionId=${competitionId}`);
		promises.push(footballData.getTeamsFromCompetition({ competitionId }));
	});

	return Promise.all(promises)
		.then((results) => {
			const [sofifaTeams, ...fooballDataResults] = results;
			let footballDataTeams = [];

			fooballDataResults.forEach((teamResult) => {
				footballDataTeams = [...footballDataTeams, ...teamResult.teams];
			});

			return mapTeamIds(footballDataTeams, sofifaTeams);
		})
}

// footballDataToSofifaTeamId = (footballDataTeams, sofifaTeams).then((result) => console.log(result))
const footballDataToSofifaTeamId = {
	"2": 10029,
	"3": 32,
	"4": 22,
	"5": 21,
	"6": 34,
	"8": 485,
	"9": 166,
	"10": 36,
	"11": 175,
	"12": 38,
	"14": 171,
	"15": 169,
	"16": 100409,
	"17": 25,
	"18": 23,
	"19": 1824,
	"24": 110636,
	"57": 1,
	"58": 2,
	"59": 3,
	"60": 4,
	"61": 5,
	"62": 7,
	"63": 144,
	"64": 9,
	"65": 10,
	"66": 11,
	"67": 13,
	"68": 1792,
	"69": 15,
	"70": 1806,
	"72": 1960,
	"73": 18,
	"74": 109,
	"75": 1917,
	"76": 110,
	"77": 448,
	"78": 240,
	"80": 452,
	"81": 241,
	"82": 1860,
	"86": 243,
	"87": 480,
	"88": 1853,
	"90": 449,
	"92": 457,
	"94": 483,
	"95": 461,
	"98": 47,
	"99": 110374,
	"100": 52,
	"102": 39,
	"103": 189,
	"104": 1842,
	"106": 192,
	"107": 110556,
	"108": 44,
	"109": 45,
	"110": 46,
	"112": 50,
	"113": 48,
	"115": 55,
	"250": 462,
	"263": 463,
	"278": 467,
	"298": 110062,
	"299": 110839,
	"322": 1952,
	"328": 1796,
	"332": 88,
	"338": 95,
	"340": 17,
	"341": 8,
	"342": 91,
	"343": 12,
	"345": 1807,
	"346": 1795,
	"349": 94,
	"351": 14,
	"354": 1799,
	"355": 1793,
	"356": 1794,
	"384": 97,
	"385": 1797,
	"387": 1919,
	"394": 1939,
	"397": 1808,
	"402": 1925,
	"445": 1746,
	"470": 111657,
	"471": 111974,
	"496": 744,
	"498": 237,
	"503": 236,
	"511": 1809,
	"514": 210,
	"516": 219,
	"518": 70,
	"521": 65,
	"522": 72,
	"523": 66,
	"524": 73,
	"526": 59,
	"527": 1819,
	"528": 110569,
	"529": 74,
	"530": 1816,
	"532": 1530,
	"538": 62,
	"543": 71,
	"547": 379,
	"548": 69,
	"556": 224,
	"558": 450,
	"559": 481,
	"563": 19,
	"576": 76,
	"583": 1900,
	"584": 1837,
	"586": 54,
	"668": 100651,
	"670": 1971,
	"671": 100634,
	"672": 1907,
	"673": 1913,
	"674": 247,
	"675": 246,
	"676": 1903,
	"677": 1915,
	"678": 245,
	"679": 1909,
	"680": 650,
	"681": 1904,
	"682": 1906,
	"684": 1914,
	"715": 1961,
	"721": 112172,
	"745": 100888,
	"810": 1898,
	"1044": 1943,
	"1049": 112516,
	"1081": 1801,
	"1103": 518,
	"1107": 112791,
	"1903": 234,
	"1913": 635,
	"1914": 100628,
	"1920": 634,
	"5529": 1891,
	"5530": 1438,
	"5543": 1887,
	"5544": 666,
	"5565": 10019,
	"5568": 1889,
	"5575": 1893,
	"5601": 10031,
	"5613": 1896,
	"5620": 665
};

export default footballDataToSofifaTeamId;