import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import moment from 'moment';
import truncate from 'lodash/truncate';
import Image from './Image';
import Loader from './Loader';
import PageHeader from './PageHeader';
import defaultArticleImage from '../../public/images/Default_Article_Image.jpg';

// TODO: convert into presentation component
class Headlines extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headlineIndex: 0,
		};
	}

	onClickImage = (index) => {
		const { headlines } = this.props;
		const headline = headlines[index];
		const win = window.open(headline.url, '_blank');
		win.focus();
	}

	onChangeHeadline = (headlineIndex) => {
		this.setState(() => ({ headlineIndex }));
	}

	renderHeadlineImage = (article) => {
		const publishedAt = moment(article.publishedAt, 'YYYY-MM-DD').format('MMMM Do, YYYY');
		const description = truncate(article.description, {
			length: 130,
			separator: ' ',
		});

		return (
			<div key={article.publishedAt}>
				<Image alt='headline' src={article.urlToImage} defaultImage={defaultArticleImage} />
				<div className='legend'>
					<p className='headline__title'>{article.title}</p>
					<p className='headline__description'>{description}</p>
					<p className='headline__date'>{publishedAt}</p>
				</div>
			</div>
		);
	}

	renderHeadlineCards = () => {
		const { headlines } = this.props;
		const { headlineIndex } = this.state;
		const components = [];

		headlines.forEach((headline, index) => {
			const className = (index === headlineIndex) ? 'headline__card card card--selected' : 'headline__card card'
			components.push((
				<div
					key={headline.url}
					className={className}
					tabIndex={index}
					role='button'
					onClick={() => this.onChangeHeadline(index)}
					onKeyPress={() => this.onChangeHeadline(index)}>{headline.title}</div>
			));
		});

		return components;
	}

	renderHeadlineImageSlider = () => {
		const { headlines } = this.props;
		const { headlineIndex } = this.state;

		return (headlines.length > 0 ?
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
					onChange={this.onChangeHeadline}
				>
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
		return (
			<PageHeader>
				<div className='headline'>
					<div className='headline__image'>
						{
							this.renderHeadlineImageSlider()
						}
					</div>
					<div className='headline__card-list'>
						{
							this.renderHeadlineCards()
						}
					</div>
				</div>
			</PageHeader>
		);
	}
}

export const MockHeadlines = Headlines;

Headlines.propTypes = {
	headlines: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
	headlines: state.news.headlines,
});

export default connect(
	mapStateToProps,
	undefined,
)(Headlines);
