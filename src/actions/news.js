import NewsAPI from 'newsapi';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import { newsSources } from '../settings';

export const setHeadlines = (headlines) => ({
    type: 'SET_HEADLINES',
    headlines,
});

const setNewsAtIndex = ({ articles, index }) => ({
    type: 'SET_NEWS_AT_INDEX',
    articles,
    index,
});

export const startSetNewsAtIndex = (index) => {
    return (dispatch) => {
        return database
            .ref(`cachedData/news/data/${index}/articles`)
            .once('value')
            .then((snapshot) => {
                let articles = [];
                snapshot.forEach((childSnapshot) => {
                    articles.push(childSnapshot.val());
                });
                dispatch(setNewsAtIndex({ index, articles }));
            });
    }
}

const setNews = (news) => ({
    type: 'SET_NEWS',
    news,
});

const filterOldNews = (newsList, currentIndex) => {
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
    const sources = Object.keys(newsSources).join(',');

    return newsapi.v2.topHeadlines({
        sources,
        pageSize: 100,
    })
    .then((response) => {
        updateCacheTime('news', { currentIndex: ++currentIndex });
        const newsList = response.articles;
        return filterOldNews(newsList, currentIndex);
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
        return filteredNewsList;
    })
    .catch((err) => {
        console.log('refreshNews:', err);
        return filteredNewsList;
    });
}

export const startSetNews = () => {
    return (dispatch, getState) => {
        if (getState().news.meta.currentIndex !== -1) {
            return Promise.resolve();
        }

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
