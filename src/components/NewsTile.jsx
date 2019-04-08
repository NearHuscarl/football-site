import React from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import '../styles/components/_carousel.scss';
import { history } from '../routers/AppRouter';

class NewsTile extends React.Component {
    constructor(props) {
        super(props);
    }

    onClickNews = (index) => {
        const { headlines } = this.state;
        const headline = headlines[index];
        let win = window.open(headline.url, '_blank');
        win.focus();
    }

    render() {
        const { articles } = this.props;

        return (
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
                            <div key={article.publishedAt}>
                                <img src={article.urlToImage} />
                                <p className='headline__title'>{article.title}</p>
                            </div>
                        ))
                    }
                </Carousel>
            </div>
        );
    }
}

const getArticlesThatIsNotHeadline = (news, headlines) => {
    const { currentIndex } = news.meta;
    if (currentIndex === -1 || headlines.length === 0) return [];
    const articles = news.articles[currentIndex];

    return articles.filter((article) => {
        return !headlines.includes(article.url);
    });
}

const mapStateToProps = (state) => ({
    articles: getArticlesThatIsNotHeadline(state.news, state.news.headlines),
})

export default connect(
    mapStateToProps,
    undefined
)(NewsTile);
