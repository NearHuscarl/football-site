import React from 'react';
import { connect } from 'react-redux';
import {
	setStandingCompetitionFilter,
	setStandingYear,
	setStandingScoreType,
} from '../actions/standingFilters';
import { startSearchStanding } from '../actions/standingResult';
import PageHeader from './PageHeader';
import SelectOptions from './SelectOptions';
import {
	competitionNames,
	standingScores,
	standingYears,
} from '../settings';

export class StandingFilters extends React.Component {
	constructor(props) {
		super(props);
	}

	onCompetitionOptionChange = (option) => {
		this.props.setStandingCompetitionFilter(option.value);
		this.props.startSearchStanding();
	}

	onYearOptionChange = (option) => {
		this.props.setStandingYear(option.value);
		this.props.startSearchStanding();
	}

	onScoreOptionChange = (option) => {
		this.props.setStandingScoreType(option.value);
		this.props.startSearchStanding();
	}

	getOption = (optionId, optionSource) => {
		return {
			label: optionSource[optionId],
			value: optionId,
		};
	}

	getOptions = (source) => {
		const options = Object.keys(source)
			.map((sourceId) => {
				const sourceName = source[sourceId];
				return {
					label: sourceName,
					value: sourceId,
				};
			});

		return options;
	}

	render() {
		const { filters } = this.props;

		return (
			<PageHeader title='Standing'>
				<div className="input-group">
					<div className="input-group__item">
						<SelectOptions
							width='18rem'
							defaultValue={this.getOption(filters.competition, competitionNames)}
							onChange={this.onCompetitionOptionChange}
							options={this.getOptions(competitionNames)}
							placeholder='Select competition...'
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							width='18rem'
							defaultValue={this.getOption(filters.year, standingYears)}
							onChange={this.onYearOptionChange}
							options={this.getOptions(standingYears)}
							placeholder='Select year...'
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							width='18rem'
							defaultValue={this.getOption(filters.scoreType, standingScores)}
							onChange={this.onScoreOptionChange}
							options={this.getOptions(standingScores)}
							placeholder='Home/Away score'
						/>
					</div>
				</div>
			</PageHeader>
		);
	}
}

const mapStateToProps = (state) => ({
	filters: state.standingFilters,
});

const mapDispatchToProps = (dispatch) => ({
	setStandingCompetitionFilter: (competitionId) => dispatch(setStandingCompetitionFilter(competitionId)),
	setStandingYear: (year) => dispatch(setStandingYear(year)),
	setStandingScoreType: (type) => dispatch(setStandingScoreType(type)),
	startSearchStanding: () => dispatch(startSearchStanding()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(StandingFilters);
