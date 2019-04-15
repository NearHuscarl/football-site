import React from 'react';
import PropTypes from 'prop-types';
import NewsListItem from './NewsListItem';

export class NewsList extends React.Component {
    constructor(props) {
        super(props);
    }

    renderArticle = (article, highlightedWord) => (
        <NewsListItem key={article.url} {...article} highlightedWord={highlightedWord} />
    );

    renderArticles = () => {
        const { articles, highlightedWord } = this.props;
        let components = [];

        articles.forEach((article) => {
            components.push(this.renderArticle(article, highlightedWord));
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
        return (
            <div className='content-container'>
                <hr className='top-border' />
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
    highlightedWord: PropTypes.string,
};

NewsList.defaultProps = {
    renderSeeMoreButton: false,
};

export default NewsList;
