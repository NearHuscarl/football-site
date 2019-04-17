import React from 'react';
import { connect } from 'react-redux';
import {
	setMatchCompetitionFilter,
	setMatchDate,
} from '../actions/matchFilters';
import { startSearchMatches } from '../actions/matchResults';
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
		this.props.setMatchDate(date);
		this.props.startSearchMatches();
	};

	onSourceChange = (option) => {
		this.props.setMatchCompetitionFilter(option.value);
		this.props.startSearchMatches();
	}

	getSourceOptions = () => {
		const options = Object.keys(competitionNames)
			.map((competitionId) => {
				const competitionName = competitionNames[competitionId];
				return {
					label: competitionName,
					value: Number(competitionId),
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
							width='18rem'
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
	filters: state.matchFilters,
});

const mapDispatchToProps = (dispatch) => ({
	setMatchCompetitionFilter: (competitionId) => dispatch(setMatchCompetitionFilter(competitionId)),
	setMatchDate: (date) => dispatch(setMatchDate(date)),
	startSearchMatches: () => dispatch(startSearchMatches()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixtureListFilters);
