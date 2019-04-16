import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
	setFixtureCompetitionFilter,
	setFixtureDate,
} from '../actions/fixtureFilters';
import { startSearchNews } from '../actions/newsResults';
import PageHeader from './PageHeader';
import SelectOptions from './SelectOptions';
import Date from './Date';
import { competitionNames } from '../settings';

export class FixtureListFilters extends React.Component {
	constructor(props) {
		super(props);
		this.allOption = {
			label: 'All',
			value: 'all',
		};
	}

	onDateChange = (date) => {
		this.props.setFixtureDate(date);
	};

	onSourceChange = (option) => {
		this.props.setFixtureCompetitionFilter(option.value);
	}

	getSourceOptions = () => {
		const options = Object.keys(competitionNames)
			.map((competitionId) => {
				const competitionName = competitionNames[competitionId];
				return {
					label: competitionName,
					value: competitionId,
				};
			});

		options.unshift(this.allOption);
		return options;
	}

	render() {
		return (
			<PageHeader title='Fixture'>
				<div className="input-group">
					<div className="input-group__item">
						<SelectOptions
							width='15rem'
							defaultValue={this.allOption}
							onChange={this.onSourceChange}
							options={this.getSourceOptions()}
							placeholder='Select competition...'
						/>
					</div>
					<div className="input-group__item">
						<Date
							date={this.props.filters.date}
							onDateChange={this.onDateChange} />
					</div>
				</div>
			</PageHeader>
		);
	}
}

const mapStateToProps = (state) => ({
	filters: state.fixtureFilters,
});

const mapDispatchToProps = (dispatch) => ({
	setFixtureCompetitionFilter: (competitionId) => dispatch(setFixtureCompetitionFilter(competitionId)),
	setFixtureDate: (date) => dispatch(setFixtureDate(date)),
	// startSearchNews: () => dispatch(startSearchNews()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixtureListFilters);
