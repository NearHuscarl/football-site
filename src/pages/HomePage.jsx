import React from 'react';
import { connect } from 'react-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import '../styles/components/_carousel.scss';
import _ from 'lodash';
import { startSetNews } from '../actions/news';
import moment from 'moment';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headlines: [],
        };
        
        props.startSetNews()
            .then(() => {
                const { articles } = this.props;
                const randomArticles = _.take(_.shuffle(articles), 4);
                this.setState(() => ({ headlines: randomArticles }));
            });
    }

    openArticle = (index) => {
        const { headlines } = this.state;
        const headline = headlines[index];
        
        let win = window.open(headline.url, '_blank');
        win.focus();
    }

    renderHeadline = (article) => {
        if (!article) return null;
        const publishedAt = moment(article.publishedAt, 'YYYY-MM-DD').format('MMMM Do, YYYY');
        const description = article.description.split(' ', 30).join(' ') + '...';

        return (
            <div>
                <img src={article.urlToImage} />
                <div className="legend">
                    <p style={{fontWeight: 'bold'}}>{article.title}</p>
                    <p>{description}</p>
                    <p style={{ position: 'absolute', bottom: '0' }}>{publishedAt}</p>
                </div>
            </div>
        );
    }

    render() {
        const { headlines } = this.state;

        return (
            <div className="content-container">
                <Carousel
                    width="50rem"
                    useKeyboardArrows
                    infiniteLoop
                    autoPlay
                    interval={5000}
                    showThumbs={false}
                    showStatus={false}
                    onClickItem={this.openArticle}>
                    { this.renderHeadline(headlines[0]) }
                    { this.renderHeadline(headlines[1]) }
                    { this.renderHeadline(headlines[2]) }
                    { this.renderHeadline(headlines[3]) }
                </Carousel>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    articles: state.news.articles,
})

const mapDispatchToProps = (dispatch) => ({
    startSetNews: () => {
        return dispatch(startSetNews());
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomePage);
