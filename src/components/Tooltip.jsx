import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Portal } from 'react-portal';
import has from 'lodash/has';
import store from '../store/configureStore';
import Image from './Image';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import { setTooltipActive, setTooltipInactive } from '../actions/tooltip';

class Tooltip extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			mouseInTooltipText: false,
			left: 0,
			top: 0,
		};
		this.estimatedWidth = 450;
		this.estimatedHeight = 200;
	}

	onMouseEnterTooltip = (e) => {
		if (this.props.otherTooltipActive) return;
		
		let offsetX = -5;
		let offsetY = -250;
		if (e.clientX + this.estimatedWidth > window.innerWidth) {
			offsetX = -this.estimatedWidth;
		}
		if (e.clientY - this.estimatedHeight < 0) {
			offsetY = 5;
		}
		const x = e.pageX + offsetX;
		const y = e.pageY + offsetY;
		this.setState(() => {
			this.props.setTooltipActive();
			return {
				isVisible: true,
				left: x,
				top: y,
			};
		});
	}

	onMouseLeaveTooltip = () => {
		setTimeout(() => {
			if (!this.state.mouseInTooltipText) {
				this.setState(() => {
					this.props.setTooltipInactive();
					return { isVisible: false };
				});
			}
		}, 125);
	}

	onMouseEnterTooltipText = () => {
		this.setState(() => ({ mouseInTooltipText: true }));
	}

	onMouseLeaveTooltipText = () => {
		this.setState(() => {
			this.props.setTooltipInactive();
			return {
				mouseInTooltipText: false,
				isVisible: false,
			};
		});
	}

	getTeam = () => {
		const teamId = this.props.id;
		const teams = store.getState().teams.models;
		const competitionIds = Object.keys(teams);

		for (let i = 0; i < competitionIds.length; i+=1) {
			const competitionId = competitionIds[i];
			
			if (has(teams[competitionId], teamId)) {
				return teams[competitionId][teamId];
			}
		}
		return null;
	}

	renderTooltipText = () => {
		const { isVisible } = this.state;
		const team = this.getTeam();
		const tooltipStyle = {
			position: 'absolute',
			left: this.state.left,
			top: this.state.top,
		};

		return (
			<CSSTransition
				mountOnEnter
				unmountOnExit
				classNames='tooltip' in={isVisible} timeout={500}>
				{
					team ?
						<Portal>
							<div className='tooltip' style={tooltipStyle}
								onMouseEnter={this.onMouseEnterTooltipText}
								onMouseLeave={this.onMouseLeaveTooltipText}>
								<div className='tooltip-team__image'>
									{
										<Image alt='team logo' src={team.crestUrl} defaultImage={defaultLogo} />
									}
								</div>
								<div className='tooltip-team__text'>
									<div>
										<span className='bold'>Code:</span>{' '}
										{team.tla}
									</div>
									<div>
										<span className='bold'>Area:</span>{' '}
										{team.area.name}
									</div>
									<div>
										<span className='bold'>Club color:</span>{' '}
										{team.clubColors}
									</div>
									<div>
										<span className='bold'>Founded:</span>{' '}
										{team.founded}
									</div>
									<div>
										<span className='bold'>Venue:</span>{' '}
										{team.venue}
									</div>
									<div>
										<span className='bold'>Email:</span>{' '}
										{team.email}
									</div>
									<div>
										<span className='bold'>Address:</span>{' '}
										{team.address}
									</div>
									<div>
										<span className='bold'>Website:</span>{' '}
										<a href={team.website} target='_blank' rel='noreferrer noopener'>{team.website}</a>
									</div>
								</div>
							</div>
						</Portal>
						:
						<span/>
				}
			</CSSTransition>
		);
	}

	render() {
		// TODO: split into TeamTooltip
		const { props } = this;
		let className = 'tooltip-trigger';
		if (props.className) {
			className += ` ${props.className}`;
		}

		return (
			<React.Fragment>
				<strong
					onMouseEnter={this.onMouseEnterTooltip}
					onMouseLeave={this.onMouseLeaveTooltip}
					className={className}>
					{props.children}
				</strong>
				{
					this.renderTooltipText()
				}
			</React.Fragment>
		);
	}
}

Tooltip.propTypes = {
	id: PropTypes.number.isRequired,
	otherTooltipActive: PropTypes.bool.isRequired,
	setTooltipActive: PropTypes.func.isRequired,
	setTooltipInactive: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	otherTooltipActive: state.tooltip.active,
});

const mapDispatchToProps = (dispatch) => ({
	setTooltipActive: () => dispatch(setTooltipActive()),
	setTooltipInactive: () => dispatch(setTooltipInactive()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Tooltip);
