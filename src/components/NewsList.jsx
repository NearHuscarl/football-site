import React from 'react';
import PropTypes from 'prop-types';
import NewsListItem from './NewsListItem';

export class NewsList extends React.Component {
    constructor(props) {
        super(props);
    }

    renderArticle = (article) => (<NewsListItem key={article.url} {...article} />);

    renderArticles = () => {
        const { articles } = this.props;
        let components = [];

        articles.forEach((article, index) => {
            components.push(this.renderArticle(article));
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
};

NewsList.defaultProps = {
    renderSeeMoreButton: false,
};

export default NewsList;
