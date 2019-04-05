import database from '../firebase/firebase';
import moment from 'moment';
import NewsAPI from 'newsapi';
import { newsDefaultState } from '../reducers/news';
import settings from '../settings';

const setNews = (news) => ({
    type: 'SET_NEWS',
    news,
});

const filterNews = (newsList, currentIndex) => {
    const footballNewsList = newsList.filter(article => /\/(football|soccer)\b/.test(article.url));
    
    let oldIndexes = []; // check new source with older news and remove duplicated ones
    [1, 2, 3].forEach((i) => { 
        if (currentIndex - i >= 0)
        oldIndexes.push(currentIndex - i);
    });

    let promises = [];
    let oldUrls = {}; // mimic C# HashSet
    
    oldIndexes.forEach((oldIndex) => {
        promises.push(database
            .ref(`cachedData/news/data/${oldIndex}/articles`)
            .once('value')
            .then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const { url } = childSnapshot.val();
                    oldUrls[url] = true;
                });
            })
        );
    });

    return Promise.all(promises)
        .then(() => {
            return footballNewsList.filter((news) => {
                return !oldUrls[news.url];
            });
        });
}

const refreshNews = (currentIndex) => {
    let filteredNewsList = [];
    const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

    return newsapi.v2.topHeadlines({
        sources: 'bbc-news,talksport,the-sport-bible,fox-sports',
        pageSize: 100,
    })
    .then(response => {
        const meta = {
            lastUpdated: moment().valueOf(),
            currentIndex: ++currentIndex,
        };

        database
            .ref('cachedData/news/meta')
            .set(meta);
            
        const newsList = response.articles;
        return filterNews(newsList, currentIndex);
    })
    .then((newsList) => {
        filteredNewsList = newsList;
        database
            .ref(`cachedData/news/data/${currentIndex}/totalArticles`)
            .set(filteredNewsList.length);

        let promises = [];

        filteredNewsList.forEach(article => {
            promises.push(database
                .ref(`cachedData/news/data/${currentIndex}/articles`)
                .push(article));
        });

        return Promise.all(promises);
    })
    .then(() => {
        return Promise.resolve(filteredNewsList);
    })
    .catch((err) => {
        console.log('[football-site err]:', err);
    });
}

export const startSetNews = () => {
    return (dispatch) => {
        let meta = newsDefaultState.meta;

        return database
            .ref('cachedData/news/meta')
            .once('value')
            .then((snapshot) => {
                if (snapshot.val()) {
                    meta = snapshot.val();
                }

                const now = moment();
                const lastUpdated = moment(meta.lastUpdated);
                const cacheTime = moment.duration(now.diff(lastUpdated));
                let promise = Promise.resolve(null);
                console.log(`${(settings.newsCacheTime - cacheTime.asHours()).toFixed(2)} hour(s) left before refreshing news`);

                if (cacheTime.asHours() > settings.newsCacheTime) {
                    promise = refreshNews(meta.currentIndex)
                        .then((news) => {
                            return {
                                ...meta,
                                articles: news,
                            };
                        });
                } else {
                    promise = database
                        .ref(`cachedData/news/data/${meta.currentIndex}/articles`)
                        .once('value')
                        .then((snapshot) => {
                            let news = [];
                            snapshot.forEach((childSnapshot) => {
                                news.push(childSnapshot.val());
                            });
                            return {
                                ...meta,
                                articles: news,
                            };
                        })
                }
                return promise;
            })
            .then((news) => {
                dispatch(setNews(news));
            });
    }
}