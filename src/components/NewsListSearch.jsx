import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
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
        const { articles, isSearching, query } = this.props;

        return (
            isSearching ?
                <Loader height='40vh' />
                :
                articles.length > 0 ?
                    <NewsList
                        highlightedWord={query}
                        articles={this.getRenderedArticles(articles)}
                        renderSeeMoreButton={articleCount < articles.length && articleCount < settings.maxArticlesPerPage}
                        onClickSeeMoreButton={this.requestMoreResults} />
                    :
                    <Redirect to="/news" />
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
    query: state.newsFilters.text,
    isSearching: state.newsResults.isSearching,
});

export default connect(
    mapStateToProps,
    undefined,
)(NewsListSearch);
