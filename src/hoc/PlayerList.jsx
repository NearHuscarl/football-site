import React from 'react';
import PlayerDetailModal from '../components/PlayerDetailModal';
import getDisplayName from '../utilities/getDisplayName';

const withPlayerModal = (WrappedComponent) =>
	class extends React.Component {
		static displayName = `WithPlayerModal(${getDisplayName(WrappedComponent)})`;

		constructor(props) {
			super(props);
			this.state = {
				isPlayerModalOpen: false,
				selectedPlayer: null,
			};
		}

		onClickPlayer = (player) => {
			this.setState(() => ({
				isPlayerModalOpen: true,
				selectedPlayer: player,
			}));
		}

		closePlayerModal = () => {
			this.setState(() => ({
				isPlayerModalOpen: false,
			}));
		};

		render() {
			return (
				<React.Fragment>
					<WrappedComponent onClickPlayer={this.onClickPlayer} {...this.props} />
					<PlayerDetailModal
						isOpen={this.state.isPlayerModalOpen}
						onRequestClose={this.closePlayerModal}
						player={this.state.selectedPlayer}
					/>
				</React.Fragment>
			);
		}
	}

export default withPlayerModal;