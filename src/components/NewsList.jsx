import React from 'react';
import PropTypes from 'prop-types';
import NewsListItem from './NewsListItem';

export class NewsList extends React.Component {
    constructor(props) {
        super(props);
    }

    // Render NewsListItem is expensive so we need to limit rendering time to minimal
    shouldComponentUpdate(nextProps) {
        if (this.props.articles.length != nextProps.articles.length) {
            return true;
        }
        return false;
    }

    renderArticle = (article, highlightedWords) => (
        <NewsListItem key={article.url} {...article} highlightedWords={highlightedWords} />
    );

    renderArticles = () => {
        const { articles, highlightedWords } = this.props;
        let components = [];

        articles.forEach((article) => {
            components.push(this.renderArticle(article, highlightedWords));
        });

        return components;
    }

    renderSeeMoreButton = () => {
        const { renderSeeMoreButton, onClickSeeMoreButton } = this.props

        return (renderSeeMoreButton ?
            <button className='button button--red'
                onClick={onClickSeeMoreButton}>
                See more
            </button>
            :
            <p>End of list</p>
        );
    }

    render() {
        console.log('render newslist');
        return (
            <div className='content-container'>
                <hr className='list-item-top-border' />
                {
                    this.renderArticles()
                }
                <div className='see-more'>
                    {
                        this.renderSeeMoreButton()
                    }
                </div>
            </div>
        );
    }
}

NewsList.propTypes = {
    articles: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClickSeeMoreButton: PropTypes.func,
    renderSeeMoreButton: PropTypes.bool,
    highlightedWords: PropTypes.string,
};

NewsList.defaultProps = {
    renderSeeMoreButton: false,
};

export default NewsList;
