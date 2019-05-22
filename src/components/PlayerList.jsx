import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import take from 'lodash/take';
import PlayerListHeader from './PlayerListHeader';
import Image from './Image';
import Position from './Position';
import Rating from './Rating';
import StarRating from './StarRating';
import { TooltipTeamHistory } from './TooltipTeam';
import defaultAvatar from '../../public/images/Default_Player_Avatar.png';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import { playerPropTypes } from '../utilities/footballProptypes';
import withPlayerModal from '../hoc/PlayerList';
import { historyPropTypes } from '../utilities/routerProptypes'

class PlayerList extends React.Component {
	constructor(props) {
		super(props);
		this.rowHeight = 60; // px
	}

	avatarRenderer = (params) => {
		const src = params.value;
		const player = params.data;
		const { onClickPlayer } = this.props;

		return (
			<figure className='player-avatar a'>
				<Image
					onClick={() => onClickPlayer(player)}
					onKeyPress={() => onClickPlayer(player)}
					alt='avatar'
					src={src}
					defaultImage={defaultAvatar} />
			</figure>
		);
	}

	// custom renderers will be wrapped into .ag-react-container which will center vertically content
	defaultRowRenderer = (params) => <div>{params.value}</div>
	
	nameRenderer = (params) => {
		const player = params.data;
		const { onClickPlayer } = this.props;

		return (
			<div>
				<div
					role='button'
					tabIndex={-1}
					onClick={() => onClickPlayer(player)}
					onKeyPress={() => onClickPlayer(player)}
					className='bold a'>
					{player.shortName}
				</div>
				<div>
					<Image
						className='flag'
						alt='country flag'
						src={player.countryFlag} />
					<span>
						<StarRating score={player.stats.internationalReputation} />
					</span>
				</div>
			</div>
		);
	}
	
	teamRenderer = (params) => {
		const team = params.value;
		if (!this.props.history) return null;

		return (
			<span className='vertical-align'>
				<TooltipTeamHistory id={team.id} history={this.props.history}>
					<div className='vertical-align mr-s a'>
						<Image alt='team logo' src={team.logo} defaultImage={defaultLogo} />
					</div>
				</TooltipTeamHistory>
				{team.name}
			</span>
		);
	}

	teamNameComparer = (team1, team2) => {
		if (team1.name === team2.name) return 0;
		return team1.name > team2.name ? 1 : -1;
	}

	positionRenderer = (params) => {
		const positions = params.value;

		return <Position>{take(positions, 2)}</Position>;
	}

	ratingRenderer = (params) => {
		const rating = params.value;

		return <Rating>{rating}</Rating>;
	}
	
	// Stats is number with unit in string: '83kg', '$470K', '1.89m'...
	statsComparer = (stats1, stats2) => {
		const getNumber = (stats) => Number(stats.replace(/[^\d]/g, ''))
		const num1 = getNumber(stats1);
		const num2 = getNumber(stats2);

		if (num1 === num2) return 0;
		return num1 > num2 ? 1 : -1;
	}

	render() {
		const { displayTeam, displayHeight, displayWeight, players } = this.props;

		return (
			<div className='ag-theme-balham table-wrapper'>
				<AgGridReact
					defaultColDef={{
						sortable: true,
						cellRenderer: 'defaultRowRenderer',
						width: 75,
					}}
					frameworkComponents={{
						defaultRowRenderer: this.defaultRowRenderer,
						avatarRenderer: this.avatarRenderer,
						nameRenderer: this.nameRenderer,
						teamRenderer: this.teamRenderer,
						positionRenderer: this.positionRenderer,
						ratingRenderer: this.ratingRenderer,
						// loadingOverlayComponent: this.loadingOverlayComponent,
						agColumnHeader: PlayerListHeader,
					}}
					// loadingOverlayComponent='loadingOverlayComponent'
					animateRows
					rowHeight={this.rowHeight}
					rowData={players}
					domLayout='autoHeight'
				>
					<AgGridColumn headerName='' field='avatar' width={60} sortable={false}
						cellRenderer='avatarRenderer' cellStyle={{ padding: 0 }} />
					<AgGridColumn headerName='Name' field='shortName' width={200} cellRenderer='nameRenderer' />
					<AgGridColumn headerName='Team' field='team' width={225} cellRenderer='teamRenderer'
						comparator={this.teamNameComparer}
						hide={!displayTeam} />
					<AgGridColumn headerName='Position' field='position' width={75} cellRenderer='positionRenderer' />
					<AgGridColumn headerName='Age' field='age' width={50} />
					<AgGridColumn headerName='Overall' field='overallRating' width={67} cellRenderer='ratingRenderer' />
					<AgGridColumn headerName='Potential' field='potential' cellRenderer='ratingRenderer' />
					<AgGridColumn headerName='Value' field='value' width={69} comparator={this.statsComparer} />
					<AgGridColumn headerName='Wage' field='wage' width={69} comparator={this.statsComparer} />
					<AgGridColumn headerName='Height' field='height' width={78} hide={!displayHeight} comparator={this.statsComparer} />
					<AgGridColumn headerName='Weight' field='weight' width={84} hide={!displayWeight} comparator={this.statsComparer} />
				</AgGridReact>
			</div>
		)
	}
}

export const PlayerListMock = PlayerList;

PlayerList.propTypes = {
	players: PropTypes.arrayOf(playerPropTypes).isRequired,
	onClickPlayer: PropTypes.func,
	displayTeam: PropTypes.bool,
	displayHeight: PropTypes.bool,
	displayWeight: PropTypes.bool,
	history: historyPropTypes,
};

PlayerList.defaultProps = {
	onClickPlayer: null,
	displayTeam: false,
	displayHeight: false,
	displayWeight: false,
	history: null,
}

export default withPlayerModal(PlayerList);