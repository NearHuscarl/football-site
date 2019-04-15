import React from 'react';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import SearchBar from './SearchBar';
import {
	setNewsTextFilter,
	setNewsSourcesFilter,
	setNewsStartDate,
	setNewsEndDate,
} from '../actions/newsFilters';
import { startSearchNews } from '../actions/newsResults';
import SelectOptions from './SelectOptions';
import { newsSources } from '../settings';
import PageHeader from './PageHeader';

export class NewsListFilters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			calanderFocused: null,
		};
	}

	onDatesChange = ({ startDate, endDate }) => {
		this.props.setNewsStartDate(startDate);
		this.props.setNewsEndDate(endDate);
	};

	onFocusChange = (calanderFocused) => {
		this.setState(() => ({ calanderFocused }));
	};

	onSourceChange = (options) => {
		this.props.setNewsSourcesFilter(options.map((option) => option.value));
	}

	getSourceOptions = () => {
		return Object.keys(newsSources).map((sourceId) => {
			const sourceName = newsSources[sourceId];
			return {
				label: sourceName,
				value: sourceId,
			};
		})
	}

	onSubmit = (query) => {
		this.props.setNewsTextFilter(query);
		const { filters } = this.props;
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
							defaultValue={this.getSourceOptions()}
							isMulti
							onChange={this.onSourceChange}
							options={this.getSourceOptions()}
							placeholder='Select (multiple) news sources...'
						/>
					</div>
					<div className="input-group__item date-wrapper">
						<DateRangePicker
							startDateId=''
							endDateId=''
							startDate={this.props.filters.startDate}
							endDate={this.props.filters.endDate}
							onDatesChange={this.onDatesChange}
							focusedInput={this.state.calanderFocused}
							onFocusChange={this.onFocusChange}
							showClearDates={true}
							numberOfMonths={1}
							isOutsideRange={(day) => false}
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
	setNewsStartDate: (endDate) => dispatch(setNewsStartDate(endDate)),
	setNewsEndDate: (startDate) => dispatch(setNewsEndDate(startDate)),
	startSearchNews: () => dispatch(startSearchNews()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(NewsListFilters);
