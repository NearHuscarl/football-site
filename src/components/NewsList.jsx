import React from 'react';
import { connect } from 'react-redux';
import NewsListItem from './NewsListItem';
import Loader from './Loader';
import { startSetNews, startSetNewsAtIndex } from '../actions/news';
import settings from '../settings';

export class NewsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: -1,
            articleCount: 0,
        };
        this.ARTICLE_BATCH = 15

        props.startSetNews()
            .then(() => {
                const { lastIndex } = this.props;
                this.setState((state) => ({
                    currentIndex: lastIndex,
                    articleCount: state.articleCount + this.ARTICLE_BATCH,
                }));
            });
    }

    shouldComponentUpdate(_nextProps, nextState) {
        if (this.state.articleCount !== nextState.articleCount) {
            return true;
        }
        return false;
    }

    requestMoreArticles = () => {
        const { articles } = this.props;
        const { currentIndex, articleCount } = this.state;
        const newIndex = currentIndex - 1;

        if (articleCount + this.ARTICLE_BATCH <= articles.length) {
            this.setState((state) => ({
                articleCount: state.articleCount + this.ARTICLE_BATCH,
            }));
            return;
        }

        return this.props.startSetNewsAtIndex(newIndex)
        .then(() => {
            this.setState((state) => ({
                currentIndex: newIndex,
                articleCount: state.articleCount + this.ARTICLE_BATCH,
            }));
        });
    }

    onClickSeeMore = () => {
        this.requestMoreArticles();
    }

    renderArticle = (article) => (<NewsListItem key={article.url} {...article} />);

    renderArticles = () => {
        const { articles } = this.props;
        const { articleCount } = this.state;

        let components = [];
        let lastIndex = -1;

        articles.forEach((article, index) => {
            if (index < articleCount) {
                lastIndex = index;
                components.push(this.renderArticle(article));
            }
        });

        // store run out of articles, request more and fill the rest
        if (components.length < articleCount) {
            console.log('request')
            this.requestMoreArticles()
            .then(() => {
                for (const i = lastIndex; i < articleCount; i++) {
                    const article = articles[i];
                    components.push(this.renderArticle(article));
                }
            });
        }

        return components;
    }

    renderSeeMoreButton = () => {
        const { currentIndex, articleCount } = this.state;

        return ((currentIndex > 0 && articleCount < settings.maxArticlesPerPage) ?
            <button className='button button--red'
                onClick={this.onClickSeeMore}>
                See more
            </button>
            :
            <p>End of list</p>
            );
    }

    render() {
        const { currentIndex } = this.state;

        return (
            currentIndex !== -1 ?
                <div className='content-container'>
                    {
                        this.renderArticles()
                    }
                    <div className='see-more'>
                    {
                        this.renderSeeMoreButton()
                    }
                    </div>
                </div>
                :
                <Loader />
        );
    }
}

const getAllArticles = (articleObj) => {
    let articles = [];
    let keys = Object.keys(articleObj);
    keys.reverse();

    keys.forEach((index) => {
        articleObj[index].forEach((article) => {
            articles.push(article);
        });
    });

    return articles;
}

const mapStateToProps = (state) => ({
    articles: getAllArticles(state.news.articles),
    lastIndex: state.news.meta.currentIndex,
});

const mapDispatchToProps = (dispatch) => ({
    startSetNews: () => {
        return dispatch(startSetNews());
    },
    startSetNewsAtIndex: (index) => {
        return dispatch(startSetNewsAtIndex(index));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewsList);
