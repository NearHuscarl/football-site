import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import SearchBar from './SearchBar';
import {
	setNewsSearchQuery,
	setNewsSourcesFilter,
	setNewsStartDate,
	setNewsEndDate,
} from '../actions/newsFilters';
import { startSearchNews } from '../actions/newsResults';
import SelectOptions from './SelectOptions';
import DateRange from './DateRange';
import { newsSources } from '../settings';
import PageHeader from './PageHeader';

class NewsListFilters extends React.Component {
	onDatesChange = ({ startDate, endDate }) => {
		this.props.setNewsStartDate(startDate.format());
		this.props.setNewsEndDate(endDate.format());
	};

	onSourceChange = (options) => {
		this.props.setNewsSourcesFilter(options.map((option) => option.value));
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
		this.props.setNewsSearchQuery(query);
		this.props.startSearchNews();
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
	setNewsSearchQuery: PropTypes.func.isRequired,
	setNewsSourcesFilter: PropTypes.func.isRequired,
	setNewsStartDate: PropTypes.func.isRequired,
	setNewsEndDate: PropTypes.func.isRequired,
	startSearchNews: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	filters: state.newsFilters,
});

const mapDispatchToProps = (dispatch) => ({
	setNewsSearchQuery: (query) => dispatch(setNewsSearchQuery(query)),
	setNewsSourcesFilter: (sources) => dispatch(setNewsSourcesFilter(sources)),
	setNewsStartDate: (startDate) => dispatch(setNewsStartDate(startDate)),
	setNewsEndDate: (endDate) => dispatch(setNewsEndDate(endDate)),
	startSearchNews: () => dispatch(startSearchNews()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(NewsListFilters);
