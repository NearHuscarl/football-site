import NewsAPI from 'newsapi';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';

export const setHeadlines = (headlines) => ({
    type: 'SET_HEADLINES',
    headlines,
});

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
    .then((response) => {
        updateCacheTime('news', { currentIndex: ++currentIndex });
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
        return checkCacheTimeExpired('news')
            .then((result) => {
                const { expired, meta } = result;
                let promise = Promise.resolve(null);

                if (expired) {
                    promise = refreshNews(meta.currentIndex)
                        .then((newsList) => ({
                            meta,
                            articles: {
                                [meta.currentIndex]: newsList,
                            },
                        }));
                } else {
                    promise = database
                        .ref(`cachedData/news/data/${meta.currentIndex}/articles`)
                        .once('value')
                        .then((snapshot) => {
                            let newsList = [];
                            snapshot.forEach((childSnapshot) => {
                                newsList.push(childSnapshot.val());
                            });
                            return {
                                meta,
                                articles: {
                                    [meta.currentIndex]: newsList,
                                },
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