import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import { competitionInfo } from '../settings';

class StandingTableSmall extends React.Component {
	onGridReady = (params) => {
		this.gridApi = params.api;
	}

	getRowData = (standing) => {
		if (isEmpty(standing)) {
			return undefined;
		}
		const totalStanding = standing.standings
			.find((s) => s.type === 'TOTAL');

		return totalStanding.table.map((row) => {
			const newRow = row;
			newRow.team.name = row.team.name.replace(/\s*(FC|CF)$/, '');
			return newRow;
		});
	}

	
	isRankInRange = (rank, range) => {
		if (typeof range === 'number') {
			return rank === range;
		}
		if (isArray(range)) {
			return (range[0] <= rank && rank <= range[1]);
		}
		return false;
	}

	getRankCellClass = (params) => {
		const rank = params.value;
		const competitionId = this.props.standing.competition.id;

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
					onGridReady={this.onGridReady}
					domLayout='print'
					{...rest}>
					    <AgGridColumn headerName='#' field='position' width={36} cellStyle={{ textAlign: 'center' }} cellClass={this.getRankCellClass} />
					    <AgGridColumn headerName='Team' field='team.name' width={177} cellStyle={{ textAlign: 'left' }} />
					    <AgGridColumn headerName='P' field='playedGames' width={39} />
					    <AgGridColumn headerName='+/-' field='goalDifference' width={45} />
					    <AgGridColumn headerName='PTS' field='points' width={45} />
				</AgGridReact>
			</div>
		);
	}
}

StandingTableSmall.propTypes = {
	className: PropTypes.string,
	standing: PropTypes.shape({
		competition: PropTypes.object,
		standings: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

StandingTableSmall.defaultProps = {
	className: '',
};

export default StandingTableSmall;
