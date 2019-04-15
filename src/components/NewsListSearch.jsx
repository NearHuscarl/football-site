import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import NewsList from './NewsList';
import Loader from './Loader';
import { reduceFilters } from '../reducers/newsResults';
import settings from '../settings';
import { URLSearchParams } from 'url';

export class NewsListSearch extends React.Component {
    constructor(props) {
        super(props);
        this.ARTICLE_BATCH = 15;
        this.state = {
            articleCount: this.ARTICLE_BATCH,
        };
        // const { search } = this.props.location;
    }

    requestMoreResults = () => {
        this.setState((state) => ({
            articleCount: state.articleCount + this.ARTICLE_BATCH,
        }));
    }

    getRenderedArticles = (articles) => {
        const { articleCount } = this.state;
        let renderedArticles = [];

        articles.forEach((article, index) => {
            if (index < articleCount) {
                renderedArticles.push(article);
            }
        });

        return renderedArticles;
    }

    render() {
        console.log('render search results');
        const { articleCount } = this.state;
        const { articles } = this.props;
        if (articles === undefined) return null;

        return (
            <Suspense fallback={<Loader />}>
                <NewsList
                    articles={this.getRenderedArticles(articles)}
                    renderSeeMoreButton={articleCount < articles.length && articleCount < settings.maxArticlesPerPage}
                    onClickSeeMoreButton={this.requestMoreResults} />
            </Suspense>
        );
    }
}

// search: '?q=bitcoin&startDate=01-01-2019'
const getFiltersKey = (search) => {
    const params = new URLSearchParams(search);
    const filters = {
        query: params.get('q'),
        startDate: params.get('startDate'),
        endDate: params.get('endDate'),
        sources: params.get('sources'),
    };

    reduceFilters(filters);
}

const mapStateToProps = (state) => ({
    articles: state.newsResults.results,
});

export default connect(
    mapStateToProps,
    undefined,
)(NewsListSearch);
