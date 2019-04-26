import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import isArray from 'lodash/isArray';
import { competitionInfo } from '../settings';
import Image from './Image';
import defaultLogo from '../../public/images/Default_Team_Logo.png';

class StandingTable extends React.Component {
	constructor(props) {
		super(props);
		this.rowHeight = '35px';
		this.baseCellStyle = {
			lineHeight: this.rowHeight,
		};
	}

	onGridReady = (params) => {
		this.gridApi = params.api;
	}

	getTeamCellStyle = () => ({
		...this.baseCellStyle,
		textAlign: 'left',
		fontFamily: 'Quicksand-Medium',
		fontSize: '1.6rem',
	});

	getRankCellStyle = () => ({
		...this.baseCellStyle,
		textAlign: 'center',
	});

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

	teamNameRenderer = (params) => {
		const { name, crestUrl } = params.value;
		const src = (crestUrl || defaultLogo);

		return (
			<span className='table__team'>
				<div className='table__team-logo'>
					<Image alt='team logo' src={src} defaultImage={defaultLogo} />
				</div>
				{name}
			</span>
		);
	}

	render() {
		const { standing } = this.props;

		return (
			<div className='ag-theme-balham table-wrapper'>
				<AgGridReact
					defaultColDef={{
						sortable: true,
						width: 45,
						cellStyle: this.baseCellStyle,
					}}
					frameworkComponents={{
						teamName: this.teamNameRenderer,
					}}
					rowData={standing}
					onGridReady={this.onGridReady}
					rowHeight={parseInt(this.rowHeight, 10)}
					domLayout='print' // Remove both horizontal and vertical scrollbars
				>
					<AgGridColumn headerName='#' field='position'
						cellStyle={this.getRankCellStyle}
						cellClass={this.getRankCellClass} />
					<AgGridColumn headerName='Team' field='team' width={250}
						cellRenderer='teamName'
						cellStyle={this.getTeamCellStyle()} />
					<AgGridColumn headerName='P' field='playedGames' />
					<AgGridColumn headerName='W' field='won' />
					<AgGridColumn headerName='D' field='draw' />
					<AgGridColumn headerName='L' field='lost' />
					<AgGridColumn headerName='F' field='goalsFor' />
					<AgGridColumn headerName='A' field='goalsAgainst' />
					<AgGridColumn headerName='+/-' field='goalDifference' width={55} />
					<AgGridColumn headerName='PTS' field='points' />
				</AgGridReact>
			</div>
		);
	}
}

StandingTable.propTypes = {
	competitionId: PropTypes.number.isRequired,
	standing: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StandingTable;
