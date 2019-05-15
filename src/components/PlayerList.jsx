import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import PlayerListHeader from './PlayerListHeader';
import Image from './Image';
import Position from './Position';
import Rating from './Rating';
import StarRating from './StarRating';
import defaultAvatar from '../../public/images/Default_Player_Avatar.png';
import { playerPropTypes } from '../utilities/footballProptypes';
import withPlayerModal from '../hoc/PlayerList';

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

	positionRenderer = (params) => {
		const positions = params.value;

		return <Position>{positions}</Position>;
	}

	ratingRenderer = (params) => {
		const rating = params.value;

		return <Rating>{rating}</Rating>;
	}

	render() {
		const { players } = this.props;

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
					<AgGridColumn headerName='Position' field='team.position' width={70} cellRenderer='positionRenderer' />
					<AgGridColumn headerName='Age' field='age' width={50} />
					<AgGridColumn headerName='Overall' field='overallRating' width={67} cellRenderer='ratingRenderer' />
					<AgGridColumn headerName='Potential' field='potential' cellRenderer='ratingRenderer' />
					<AgGridColumn headerName='Value' field='value' width={69} />
					<AgGridColumn headerName='Wage' field='wage' width={69} />
				</AgGridReact>
			</div>
		)
	}
}

export const PlayerListMock = PlayerList;

PlayerList.propTypes = {
	players: PropTypes.arrayOf(playerPropTypes).isRequired,
	onClickPlayer: PropTypes.func,
};

PlayerList.defaultProps = {
	onClickPlayer: null,
}

export default withPlayerModal(PlayerList);