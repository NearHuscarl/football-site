import React from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import moment from 'moment';
import _ from 'lodash';
import '../styles/components/_carousel.scss';
import { startSetNews } from '../actions/news';

export class PageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headlines: [],
            headlineIndex: 0,
        };

        props.startSetNews()
            .then(() => {
                const { articles, meta } = this.props.news;
                const randomArticles = _.take(_.shuffle(articles[meta.currentIndex]), 4);
                this.setState(() => ({ headlines: randomArticles }));
            });
    }

    openArticle = (index) => {
        const { headlines } = this.state;
        const headline = headlines[index];

        let win = window.open(headline.url, '_blank');
        win.focus();
    }
    
    onChangeHeadlineImage = (headlineIndex) => {
        console.log(headlineIndex);
        this.setState(() => ({ headlineIndex }));
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
        const { headlines, headlineIndex } = this.state;

        return (
            <div className='page-header'>
                <div className='content-container'>
                    <div className='headline'>
                        <div className='headline__image carousel-wrapper'>
                            <Carousel
                                className=''
                                width='70rem'
                                useKeyboardArrows
                                infiniteLoop
                                // Quick fix: force rendering twice to sync headlineIndex
                                // https://github.com/leandrowd/react-responsive-carousel/issues/204#issuecomment-389538892
                                selectedItem={headlineIndex}
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
                            {this.renderHeadlineCard(headlines, 0, headlineIndex)}
                            {this.renderHeadlineCard(headlines, 1, headlineIndex)}
                            {this.renderHeadlineCard(headlines, 2, headlineIndex)}
                            {this.renderHeadlineCard(headlines, 3, headlineIndex)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    news: state.news,
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
