import React from 'react';
import { connect } from 'react-redux';
import SearchBar from './SearchBar';
import {
	setNewsTextFilter,
	setNewsSourcesFilter,
	setNewsStartDate,
	setNewsEndDate,
} from '../actions/newsFilters';
import { startSearchNews } from '../actions/newsResults';
import SelectOptions from './SelectOptions';
import DateRange from './DateRange';
import { newsSources } from '../settings';
import PageHeader from './PageHeader';

export class NewsListFilters extends React.Component {
	constructor(props) {
		super(props);
	}

	onDatesChange = ({ startDate, endDate }) => {
		this.props.setNewsStartDate(startDate);
		this.props.setNewsEndDate(endDate);
	};

	onSourceChange = (options) => {
		this.props.setNewsSourcesFilter(options.map((option) => option.value));
	}
	
	getdefaultOptions = () => {
		const { sources } = this.props.filters;

		return Object.keys(newsSources)
		.filter((sourceId) => {
			return sources.includes(sourceId);
		})
		.map((sourceId) => {
			const sourceName = newsSources[sourceId];
			return {
				label: sourceName,
				value: sourceId,
			};
		});
	}

	getSourceOptions = () => {
		return Object.keys(newsSources).map((sourceId) => {
			const sourceName = newsSources[sourceId];
			return {
				label: sourceName,
				value: sourceId,
			};
		});
	}

	onSubmit = (query) => {
		this.props.setNewsTextFilter(query);
		this.props.startSearchNews();
	}

	render() {
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
							startDate={this.props.filters.startDate}
							endDate={this.props.filters.endDate}
							onDatesChange={this.onDatesChange}
						/>
					</div>
				</div>
			</PageHeader>
		);
	}
}

const mapStateToProps = (state) => ({
	filters: state.newsFilters,
});

const mapDispatchToProps = (dispatch) => ({
	setNewsTextFilter: (text) => dispatch(setNewsTextFilter(text)),
	setNewsSourcesFilter: (sources) => dispatch(setNewsSourcesFilter(sources)),
	setNewsStartDate: (startDate) => dispatch(setNewsStartDate(startDate)),
	setNewsEndDate: (endDate) => dispatch(setNewsEndDate(endDate)),
	startSearchNews: () => dispatch(startSearchNews()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(NewsListFilters);
