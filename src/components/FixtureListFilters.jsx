import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import {
	setMatchCompetitionFilter,
	setMatchDate,
} from '../actions/matchFilters';
import startSearchMatches from '../actions/matchResults';
import PageHeader from './PageHeader';
import SelectOptions from './SelectOptions';
import Date from './Date';
import { competitions } from '../settings';

class FixtureListFilters extends React.Component {
	constructor(props) {
		super(props);
		this.allOption = {
			label: 'All',
			value: 'all',
		};
	}

	onDateChange = (date) => {
		this.props.setMatchDate(date.format());
		this.props.startSearchMatches();
	};

	onSourceChange = (option) => {
		this.props.setMatchCompetitionFilter(option.value);
		this.props.startSearchMatches();
	}

	getDefaultOption = () => {
		const { competition } = this.props.filters;
		if (competition === 'all') {
			return this.allOption;
		}
		return {
			label: competitions[competition],
			value: competition,
		};
	}

	getCompetitionOptions = () => {
		const options = Object.keys(competitions)
			.map((competitionId) => {
				const competitionName = competitions[competitionId];
				return {
					label: competitionName,
					value: Number(competitionId),
				};
			});

		options.unshift(this.allOption);
		return options;
	}

	render() {
		const { date } = this.props.filters;

		return (
			<PageHeader title='Fixture'>
				<div className="input-group">
					<div className="input-group__item">
						<SelectOptions
							width='20rem'
							defaultValue={this.getDefaultOption()}
							onChange={this.onSourceChange}
							options={this.getCompetitionOptions()}
							placeholder='Select competition...'
						/>
					</div>
					<div className="input-group__item">
						<Date
							date={moment(date)}
							onDateChange={this.onDateChange} />
					</div>
				</div>
			</PageHeader>
		);
	}
}

export const MockFixtureListFilters = FixtureListFilters;

FixtureListFilters.propTypes = {
	filters: PropTypes.shape({
		competition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		date: PropTypes.string,
	}).isRequired,
	setMatchCompetitionFilter: PropTypes.func.isRequired,
	setMatchDate: PropTypes.func.isRequired,
	startSearchMatches: PropTypes.func.isRequired,
};

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
