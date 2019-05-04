import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import SearchBar from './SearchBar';
import {
	setArticleSearchQuery,
	setArticleSourcesFilter,
	setArticleStartDate,
	setArticleEndDate,
} from '../actions/articleFilters';
import startSearchArticles from '../actions/articleResults';
import SelectOptions from './SelectOptions';
import DateRange from './DateRange';
import { newsSources } from '../settings';
import PageHeader from './PageHeader';

class NewsListFilters extends React.Component {
	onDatesChange = ({ startDate, endDate }) => {
		this.props.setArticleStartDate(startDate.format());
		this.props.setArticleEndDate(endDate.format());
	};

	onSourceChange = (options) => {
		this.props.setArticleSourcesFilter(options.map((option) => option.value));
	}
	
	getdefaultOptions = () => {
		const { sources } = this.props.filters;

		return Object.keys(newsSources)
			.filter((sourceId) => sources.includes(sourceId))
			.map((sourceId) => {
				const sourceName = newsSources[sourceId];
				return {
					label: sourceName,
					value: sourceId,
				};
			});
	}

	getSourceOptions = () =>
		Object.keys(newsSources).map((sourceId) => {
			const sourceName = newsSources[sourceId];
			return {
				label: sourceName,
				value: sourceId,
			};
		});

	onSubmit = (query) => {
		this.props.setArticleSearchQuery(query);
		this.props.startSearchArticles();
	}

	render() {
		const { startDate, endDate } = this.props.filters;
		return (
			<PageHeader>
				<div className="input-group">
					<div className="input-group__item">
						<SearchBar
							onSubmit={this.onSubmit}
							buttonClassName='button button--icon button--blue button--search'
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							closeMenuOnSelect={false}
							defaultValue={this.getdefaultOptions()}
							isMulti
							onChange={this.onSourceChange}
							options={this.getSourceOptions()}
							placeholder='Select (multiple) news sources...'
						/>
					</div>
					<div className="input-group__item">
						<DateRange
							startDate={moment(startDate)}
							endDate={moment(endDate)}
							onDatesChange={this.onDatesChange}
						/>
					</div>
				</div>
			</PageHeader>
		);
	}
}

export const MockNewsListFilters = NewsListFilters;

NewsListFilters.propTypes = {
	filters: PropTypes.shape({
		query: PropTypes.string,
		startDate: PropTypes.string,
		endDate: PropTypes.string,
		sources: PropTypes.arrayOf(PropTypes.string),
	}).isRequired,
	setArticleSearchQuery: PropTypes.func.isRequired,
	setArticleSourcesFilter: PropTypes.func.isRequired,
	setArticleStartDate: PropTypes.func.isRequired,
	setArticleEndDate: PropTypes.func.isRequired,
	startSearchArticles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	filters: state.articleFilters,
});

const mapDispatchToProps = (dispatch) => ({
	setArticleSearchQuery: (query) => dispatch(setArticleSearchQuery(query)),
	setArticleSourcesFilter: (sources) => dispatch(setArticleSourcesFilter(sources)),
	setArticleStartDate: (startDate) => dispatch(setArticleStartDate(startDate)),
	setArticleEndDate: (endDate) => dispatch(setArticleEndDate(endDate)),
	startSearchArticles: () => dispatch(startSearchArticles()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(NewsListFilters);
