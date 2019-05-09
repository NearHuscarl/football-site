import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
// import { withRouter } from 'react-router-dom'
import isArray from 'lodash/isArray';
import { competitions, competitionInfo } from '../settings';
import { TooltipTeamHistory } from './TooltipTeam';
import Image from './Image';
import Loader from './Loader';
import StandingTableHeader from './StandingTableHeader';
import defaultLogo from '../../public/images/Default_Team_Logo.png';

class StandingTable extends React.Component {
	constructor(props) {
		super(props);
		this.rowHeight = '35px';
		this.baseCellStyle = {
			lineHeight: this.rowHeight,
		};
	}

	shouldComponentUpdate(nextProps) {
		if (this.gridApi) {
			if (nextProps.loading) {
				this.gridApi.showLoadingOverlay();
			} else {
				this.gridApi.hideOverlay();
			}
		}
		if (nextProps.standing !== this.props.standing) {
			return true;
		}
		return false;
	}

	onGridReady = (params) => {
		this.gridApi = params.api;
	}

	getTeamCellStyle = () => ({
		...this.baseCellStyle,
		textAlign: 'left',
		fontFamily: 'Quicksand-Medium',
	});

	getRankCellStyle = () => ({
		...this.baseCellStyle,
		textAlign: 'center',
	});

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
		const { id, name, crestUrl } = params.value;
		const src = (crestUrl || defaultLogo);

		return (
			<span className='table__team'>
				<TooltipTeamHistory id={id} history={this.props.history}>
					<div className='table__team-logo'>
						<Image alt='team logo' src={src} defaultImage={defaultLogo} />
					</div>
				</TooltipTeamHistory>
				{name}
			</span>
		);
	}

	loadingOverlayComponent = () => (<Loader />);

	teamNameComparer = (team1, team2) => {
		if (team1.name === team2.name) return 0;
		return team1.name > team2.name ? 1 : -1;
	}

	render() {
		const { standing, competitionId } = this.props;

		return (
			<div className='ag-theme-balham table-wrapper'>
				<div className='header'>
					{ competitions[competitionId] }
				</div>
				<AgGridReact
					defaultColDef={{
						sortable: true,
						width: 45,
						cellStyle: { ...this.baseCellStyle, textAlign: 'center' },
					}}
					frameworkComponents={{
						teamNameRenderer: this.teamNameRenderer,
						loadingOverlayComponent: this.loadingOverlayComponent,
						agColumnHeader: StandingTableHeader,
					}}
					loadingOverlayComponent='loadingOverlayComponent'
					animateRows
					rowData={standing}
					getRowClass={this.getRowClass}
					rowHeight={parseInt(this.rowHeight, 10)}
					onGridReady={this.onGridReady}
					domLayout='autoHeight'
				>
					<AgGridColumn headerName='#' field='position'
						cellStyle={this.getRankCellStyle}
						cellClass={this.getRankCellClass} />
					<AgGridColumn headerName='Team' field='team' width={250}
						comparator={this.teamNameComparer}
						cellRenderer='teamNameRenderer'
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
	loading: PropTypes.bool,
	competitionId: PropTypes.number.isRequired,
	standing: PropTypes.arrayOf(PropTypes.object).isRequired,
	history: PropTypes.shape({
		push: PropTypes.func,
	}).isRequired,
};


StandingTable.defaultProps = {
	loading: false,
}

export default StandingTable;
