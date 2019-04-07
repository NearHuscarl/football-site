import FootballData from 'footballdata-api-v2';

const getCompetitions = () => {
    console.log(process.env);
    const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

    footballData.getCompetitions()
    .then((data) => {
        const { competitions } = data;
        let competitionNames = {};
        competitions.forEach((competition) => {
            competitionNames[competition.code] = competition.id
        })
        console.log(JSON.stringify(competitionNames, null, 4));
        // console.log(JSON.stringify(data, null, 4));
    })
}

export default getCompetitions;