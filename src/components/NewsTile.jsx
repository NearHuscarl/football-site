import React from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import '../styles/components/_carousel.scss';
import Loader from './Loader';

class NewsTile extends React.Component {
    constructor(props) {
        super(props);
    }

    onClickNews = (index) => {
        const { articles } = this.props;
        const article = articles[index];
        let win = window.open(article.url, '_blank');
        win.focus();
    }

    render() {
        const { articles } = this.props;

        return (
            articles.length > 0 ?
                <div className='carousel-wrapper'>
                    <Carousel
                        width='34rem'
                        useKeyboardArrows
                        infiniteLoop
                        autoPlay
                        interval={5000}
                        transitionTime={600}
                        showIndicators={false}
                        showThumbs={false}
                        showStatus={false}
                        onClickItem={this.onClickNews}>
                        {
                            articles.map((article) => (
                                <div className='tile-imageitem' key={article.publishedAt}>
                                    <img alt='news' src={article.urlToImage} />
                                    <p className='tile-text'>{article.title}</p>
                                </div>
                            ))
                        }
                    </Carousel>
                </div>
                :
                <Loader />
        );
    }
}

const getArticlesThatAreNotHeadlines = (news, headlines) => {
    const { currentIndex } = news.meta;
    if (currentIndex === -1) {
        return []
    };
    const articles = news.articles[currentIndex];
    const headlineUrls = headlines.map((headline) => headline.url);

    return articles.filter((article) => {
        return !headlineUrls.includes(article.url);
    });
}

const mapStateToProps = (state) => ({
    articles: getArticlesThatAreNotHeadlines(state.news, state.news.headlines),
})

export default connect(
    mapStateToProps,
    undefined
)(NewsTile);
