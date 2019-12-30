interface Article {
	author: string,
	content: string,
	description: string,
	publishedAt: string,
	source: {
		id: string,
		name: string,
	},
	title: string,
	url: string,
	urlToImage: string,
}

interface Season {
	id: number,
	currentMatchday: number,
	startDate: string,
	endDate: string,
	winner?: {
		id: number,
		name: string,
		shortName: string,
		tla: string,
		crestUrl: string,
	},
}

interface Competition {
	area: {
		id: string,
		name: string,
	},
	code: string,
	currentSeason: Season,
	emblemUrl: string,
	id: number,
	lastUpdated: string,
	name: string,
	numberOfAvailableSeasons: number,
	plan: string,
	team: { [x: number]: Team },
}

interface Match {
	awayTeam: {
		id: string,
		name: string,
	}
	homeTeam: {
		id: string,
		name: string,
	}
	competition: {
		id: string,
		name: string,
	}
	group: string,
	id: number,
	lastUpdated: string,
	matchday: number,
	referees: Array<{
		id: number,
		name: string,
		nationality: string,
	}>,
	score: {
		duration: string,
		winner: string,
		halfTime: {
			awayTeam: number | null,
			homeTeam: number | null,
		},
		fullTime: {
			awayTeam: number | null,
			homeTeam: number | null,
		},
		extraTime: {
			awayTeam: number | null,
			homeTeam: number | null,
		},
		penalties: {
			awayTeam: number | null,
			homeTeam: number | null,
		},
	}
	season: Season,
	stage: string,
	status: string,
	utcDate: string,
}

interface PlayerMainStats {
	bodyType: string,
	internationalReputation: number,
	preferredFoot: string,
	realFace: string,
	releaseClause: string,
	skillMoves: number,
	weakFoot: number,
	workRate: string,
}

interface PlayerTeamStats {
	id: number;
	name: string;
	logo: string;
	rating: number;
	position: Array<string>;
	shirtNumber: number;
	joinDate?: string;
	loanTeam?: {
		id: number,
		name: string,
	};
	contractEndDate: string;
};

interface PlayerNationalTeamStats {
	id: number;
	country: string;
	logo: string;
	rating: number;
	position: Array<string>;
	shirtNumber: number;
};

interface Player {
	id: number;
	shortName: string;
	name: string;
	avatar: string;
	country: string;
	countryFlag: string;
	position: Array<string>;
	height: string;
	weight: string;
	birthday: string;
	overallRating: number;
	potential: number;
	value: string;
	wage: string;
	stats: PlayerMainStats,
	team: PlayerTeamStats;
	nationalTeam: PlayerNationalTeamStats | null;
}

interface Rank {
	position: number;
	team: {
		id: number;
		name: string;
		crestUrl: string | null;
	};
	playedGames: number;
	won: number;
	draw: number;
	lost: number;
	points: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDifference: number;
}

interface Standing {
	area: {
		id: number,
		name: string,
	},
	competition: {
		id: number,
		name: string,
	},
	season: Season,
	standings: { [x in 'home' | 'away' | 'total']: Array<Rank> };
}

interface Kit {
	home: string;
	away: string;
	third: string;
	goalkeeper: string;
}

interface Contact {
	website: string;
	address: string;
	phone: string;
	fax: string;
	email: string;
}

interface Team {
	id: number;
	name: string;
	shortName: string,
	logo: string;
	area: {
		id: number,
		name: string,
	};
	competition: {
		id: number,
		name: string,
	};
	countryFlag: string;
	overall: number;
	attack: number;
	midfield: number;
	defence: number;
	domesticPrestige: number;
	internationalPrestige: number;
	rivalTeam: {
		id: number;
		name: string;
	};
	squad: Array<Player>;
	kit: Kit;
	contact?: Contact;
	clubColors: string;
	founded: string;
	tla: string;
	transferBudget: string;
	venue: string;
	lastUpdated: string;
}

interface Scorer extends Player {
	numberOfGoals: number;
}

interface TopScorers {
	area: {
		id: number,
		name: string,
	};
	competition: {
		id: number,
		name: string,
	};
	season: Season;
	scorers: Array<Scorer>;
}