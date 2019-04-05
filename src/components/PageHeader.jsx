import React from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import moment from 'moment';
import _ from 'lodash';
import '../styles/components/_carousel.scss';
import { startSetNews } from '../actions/news';

class PageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headlines: [],
            currentIndex: 0,
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
    
    onChangeHeadlineImage = (currentIndex) => {
        this.setState(() => ({ currentIndex }));
    }

    renderHeadlineImage = (article) => {
        if (!article) return null;
        const publishedAt = moment(article.publishedAt, 'YYYY-MM-DD').format('MMMM Do, YYYY');
        const description = _.truncate(article.description, {
            length: 130,
            separator: ' ',
        });

        return (
            <div>
                <img src={article.urlToImage} />
                <div className='legend'>
                    <p className='headline__title'>{article.title}</p>
                    <p className='headline__description'>{description}</p>
                    <p className='headline__date'>{publishedAt}</p>
                </div>
            </div>
        );
    }

    renderHeadlineCard = (articles, articleIndex, currentIndex) => {
        const article = articles[articleIndex];
        const className = (articleIndex === currentIndex) ? 'card card--selected' : 'card'

        return article
            && <div
                className={className}
                onClick={() => this.onChangeHeadlineImage(articleIndex)}>{article.title}</div>
    }

    render() {
        const { headlines, currentIndex } = this.state;

        return (
            <div className='page-header'>
                <div className='content-container'>
                    <div className='headline'>
                        <div className='headline__image'>
                            <Carousel
                                width='70rem'
                                useKeyboardArrows
                                infiniteLoop
                                // Quick fix: force rendering twice to sync currentIndex
                                // https://github.com/leandrowd/react-responsive-carousel/issues/204#issuecomment-389538892
                                selectedItem={currentIndex}
                                autoPlay
                                interval={5000}
                                transitionTime={600}
                                showThumbs={false}
                                showStatus={false}
                                onClickItem={this.openArticle}
                                onChange={this.onChangeHeadlineImage}>
                                {this.renderHeadlineImage(headlines[0])}
                                {this.renderHeadlineImage(headlines[1])}
                                {this.renderHeadlineImage(headlines[2])}
                                {this.renderHeadlineImage(headlines[3])}
                            </Carousel>
                        </div>
                        <div className='headline__card'>
                            {this.renderHeadlineCard(headlines, 0, currentIndex)}
                            {this.renderHeadlineCard(headlines, 1, currentIndex)}
                            {this.renderHeadlineCard(headlines, 2, currentIndex)}
                            {this.renderHeadlineCard(headlines, 3, currentIndex)}
                        </div>
                    </div>
                </div>
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
)(PageHeader);
