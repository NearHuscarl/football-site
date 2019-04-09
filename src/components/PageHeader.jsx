import React from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import moment from 'moment';
import _ from 'lodash';
import '../styles/components/_carousel.scss';
import { startSetNews, setHeadlines } from '../actions/news';
import Loader from './Loader';

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
                const headlines = _.take(_.shuffle(articles[meta.currentIndex]), 4);
                const headlineUrls = headlines.map((headline) => headline.url);

                this.props.setHeadlines(headlineUrls);
                this.setState(() => ({ headlines }));
            });
    }

    onClickImage = (index) => {
        const { headlines } = this.state;
        const headline = headlines[index];
        let win = window.open(headline.url, '_blank');
        win.focus();
    }

    onChangeHeadlineImage = (headlineIndex) => {
        this.setState(() => ({ headlineIndex }));
    }

    renderHeadlineImage = (article) => {
        const publishedAt = moment(article.publishedAt, 'YYYY-MM-DD').format('MMMM Do, YYYY');
        const description = _.truncate(article.description, {
            length: 130,
            separator: ' ',
        });

        return (
            <div key={article.publishedAt}>
                <img src={article.urlToImage} />
                <div className='legend'>
                    <p className='headline__title'>{article.title}</p>
                    <p className='headline__description'>{description}</p>
                    <p className='headline__date'>{publishedAt}</p>
                </div>
            </div>
        );
    }

    renderHeadlineCards = (headlines, currentIndex) => {
        let components = [];

        headlines.forEach((headline, index) => {
            const className = (index === currentIndex) ? 'headline__card card card--selected' : 'headline__card card'
            components.push((
                <div
                    key={index}
                    className={className}
                    onClick={() => this.onChangeHeadlineImage(index)}>{headline.title}</div>
            ));
        });

        return components;
    }

    renderHeadlineImageSlider = (headlines, headlineIndex) => {
        return (headlines.length > 0
            ?
            <div className='carousel-wrapper'>
                <Carousel
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
                    onClickItem={this.onClickImage}
                    onChange={this.onChangeHeadlineImage}>
                    {
                        headlines.map((headline) => (
                            this.renderHeadlineImage(headline)
                        ))
                    }
                </Carousel>
            </div>
            :
            <Loader type='dot-rolling' />);
    }

    render() {
        const { headlines, headlineIndex } = this.state;

        return (
            <div className='page-header'>
                <div className='content-container'>
                    <div className='headline'>
                        <div className='headline__image'>
                            {
                                this.renderHeadlineImageSlider(headlines, headlineIndex)
                            }
                        </div>
                        <div className='headline__card-list'>
                            {
                                this.renderHeadlineCards(headlines, headlineIndex)
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    news: state.news,
});

const mapDispatchToProps = (dispatch) => ({
    startSetNews: () => {
        return dispatch(startSetNews());
    },
    setHeadlines: (headlines) => {
        return dispatch(setHeadlines(headlines));
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageHeader);
