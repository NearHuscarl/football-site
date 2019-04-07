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

    renderNews = (article) => {
        if (!article) return null;
        
        return (
            <div>
                <img src={article.urlToImage} />
                <div className='legend'>
                    <p className='headline__title'>{article.title}</p>
                </div>
            </div>
        );
    }

    renderNewsList = () => {
        // const { news } = this.props;
        // const { currentIndex } = news.meta;

        // if (currentIndex === -1 || news.headlines.length === 0) {
        //     return (<div></div>);
        // }
        // const articles = news.articles[currentIndex];
        // const newsThatIsNotHeadline = articles.filter((article) => {
        //     return !news.headlines.includes(article.url);
        // })

        // return newsThatIsNotHeadline.map((article) => {
        //     return this.renderNews(article);
        // });
    }

    render() {
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
                        this.renderNewsList()
                        // newsThatIsNotHeadline.forEach((news) => {
                        //     this.renderNews(news);
                        // })
                    }
                </Carousel>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    news: state.news,
    headlines : state.news.headlines,
})

export default connect(
    mapStateToProps,
    undefined
)(NewsTile);
