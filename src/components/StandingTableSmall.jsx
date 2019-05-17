import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import isArray from 'lodash/isArray';
import { competitionInfo } from '../settings';
import trimTeamName from '../utilities/trimTeamName';
import { rankPropTypes } from '../utilities/footballProptypes';

class StandingTableSmall extends React.Component {
	isRankInRange = (rank, range) => {
		if (typeof range === 'number') {
			return rank === range;
		}
		if (isArray(range)) {
			return (range[0] <= rank && rank <= range[1]);
		}
		return false;
	}

	getRowClass = (params) => {
		const rank = params.data.position;
		const { competitionId } = this.props;

		const { championLeagueRanks } = competitionInfo[competitionId];
		if (this.isRankInRange(rank, championLeagueRanks)) {
			return 'champion-league-row';
		}
		const { eroupeLeagueRanks } = competitionInfo[competitionId];
		if (this.isRankInRange(rank, eroupeLeagueRanks)) {
			return 'europe-league-row';
		}
		const { relegationRanks } = competitionInfo[competitionId];
		if (this.isRankInRange(rank, relegationRanks)) {
			return 'delegation-row';
		}
		return '';
	}

	getRankCellClass = (params) => {
		const rank = params.value;
		const { competitionId } = this.props;

		const { championLeagueRanks } = competitionInfo[competitionId];
		if (this.isRankInRange(rank, championLeagueRanks)) {
			return 'champion-league-rank';
		}
		const { eroupeLeagueRanks } = competitionInfo[competitionId];
		if (this.isRankInRange(rank, eroupeLeagueRanks)) {
			return 'europe-league-rank';
		}
		const { relegationRanks } = competitionInfo[competitionId];
		if (this.isRankInRange(rank, relegationRanks)) {
			return 'delegation-rank';
		}
		return '';
	}

	getRowData = (standing) => standing.map((row) => {
		const newRow = row;
		newRow.team.name = trimTeamName(row.team.name);
		return newRow;
	})

	render() {
		const { className, standing, ...rest } = this.props;
		const rowData = this.getRowData(standing);

		return (
			<div className={`ag-theme-balham table-wrapper ${className}`}>
				<AgGridReact
					defaultColDef={{
						sortable: true,
					}}
					rowData={rowData}
					getRowClass={this.getRowClass}
					domLayout='print'
					{...rest}>
					    <AgGridColumn headerName='#' field='position' width={38} cellStyle={{ textAlign: 'center' }} cellClass={this.getRankCellClass} />
					    <AgGridColumn headerName='Team' field='team.name' width={177} cellStyle={{ textAlign: 'left' }} />
					    <AgGridColumn headerName='P' field='playedGames' width={39} />
					    <AgGridColumn headerName='+/-' field='goalDifference' width={44} />
					    <AgGridColumn headerName='PTS' field='points' width={45} />
				</AgGridReact>
			</div>
		);
	}
}

StandingTableSmall.propTypes = {
	className: PropTypes.string,
	standing: PropTypes.arrayOf(rankPropTypes).isRequired,
	competitionId: PropTypes.number.isRequired,
};

StandingTableSmall.defaultProps = {
	className: '',
};

export default StandingTableSmall;
