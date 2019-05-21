import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PlayerListFilters from '../components/PlayerListFilters';
import PlayerList from '../components/PlayerList';
import Loader from '../components/Loader';
import { matchPropTypes, historyPropTypes } from '../utilities/routerProptypes';
import { playerPropTypes } from '../utilities/footballProptypes';
import {
	startFetchPlayers,
	startFetchMorePlayers,
} from '../actions/playerResults';
import playerFiltersPropTypes from '../utilities/playerFiltersProptypes';

class PlayersPage extends React.Component {
	constructor(props) {
		super(props);
		this.previousMode = '';
		const { sort } = this.props.match.params;
		this.props.startFetchPlayers(sort);
	}

	componentDidUpdate(prevProps) {
		const oldSort = prevProps.match.params.sort;
		const newSort = this.props.match.params.sort;

		if (oldSort !== newSort) {
			this.props.startFetchPlayers(newSort);
		}

		if (prevProps.mode !== this.props.mode) {
			if (this.props.mode === 'search') {
				this.props.history.push('/players')
			}
		}

		return true;
	}

	renderSeeMoreButton = () => {
		const { pending } = this.props;

		return (
			<React.Fragment>{pending ?
				<Loader />
				:
				<button className='button button--red'
					type='button'
					onClick={() => this.props.startFetchMorePlayers()}>
					See more
				</button>
			}
			</React.Fragment>
		)
	}

	render() {
		const { players, endOfList, pending, mode, filters, history } = this.props;
		const isSearchingFirstTime = pending && this.previousMode !== mode && mode !== 'search';
		this.previousMode = mode;

		return (
			<React.Fragment>
				<PlayerListFilters filters={filters}/>
				<div className='content-container'>{isSearchingFirstTime ?
					<Loader height='40vh' />
					:
					<div className='container-col'>
						<PlayerList players={players} history={history}
							displayTeam
							displayHeight
							displayWeight
						/>
						<div className='see-more'>{
							!endOfList ?
								this.renderSeeMoreButton()
								:
								(players.length > 0 && <p>End of list</p>)
						}
						</div>
					</div>
				}
				</div>
			</React.Fragment>
		)
	}
}

export const MockPlayersPage = PlayersPage;

PlayersPage.propTypes = {
	startFetchPlayers: PropTypes.func.isRequired,
	startFetchMorePlayers: PropTypes.func.isRequired,
	players: PropTypes.arrayOf(playerPropTypes).isRequired,
	pending: PropTypes.bool.isRequired,
	endOfList: PropTypes.bool.isRequired,
	mode: PropTypes.string.isRequired,
	history: historyPropTypes.isRequired,
	match: matchPropTypes.isRequired,
	filters: playerFiltersPropTypes.isRequired,
};

const mapStateToProps = (state) => ({
	players: state.players.models,
	endOfList: !state.players.lastDocument,
	pending: state.players.pending,
	mode: state.players.mode,
	filters: state.playerFilters,
});

const mapDispatchToProps = (dispatch) => ({
	startFetchPlayers: (mode) => dispatch(startFetchPlayers(mode)),
	startFetchMorePlayers: () => dispatch(startFetchMorePlayers()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PlayersPage);