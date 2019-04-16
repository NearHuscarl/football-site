import FootballData from 'footballdata-api-v2';
import database from './firebase';

const footballDataAPI = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

class FirebaseUtil {

    static checkPath = (path) => {
        return database
        .ref(path)
        .once('value')
        .then((snapshot) => {
            return !!snapshot.val();
        })
    }

    // common data is info about competitions, areas
    static updateCommonData = () => {
        // TODO: update again if lastUpdated is too old (apply to competitions)
        FirebaseUtil.updateAreas();
        FirebaseUtil.updateCompetitions();
    }

    static updateAreas = () => {
        return FirebaseUtil.checkPath('data/areas')
        .then((exist) => {
            if (!exist) {
                footballDataAPI.getAreas()
                .then((data) => {
                    const { areas } = data;
                    let areaData = {};
                    areas.forEach((area) => {
                        areaData[area.id] = area;
                    })
                    return database
                        .ref('data/areas')
                        .set(areaData);
                })
                .then(() => {
                    return true;
                });
            }

            return false;
        });
        
    }

    static updateCompetitions = () => {
        return FirebaseUtil.checkPath('data/competitions')
        .then((exist) => {
            if (!exist) {
                footballDataAPI.getCompetitions({
                    plan: 'TIER_TWO', // Get all competitions from 'TIER_TWO' and 'TIER_ONE'
                })
                .then((data) => {
                    const { competitions } = data;
                    let competitionData = {};
                    competitions.forEach((competition) => {
                        competitionData[competition.id] = competition;
                    })
                    return database
                        .ref('data/competitions')
                        .set(competitionData);
                })
                .then(() => {
                    return true;
                });
            }

            return false;
        });
    }
}

export default FirebaseUtil;