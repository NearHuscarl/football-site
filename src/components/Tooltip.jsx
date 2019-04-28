import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Portal } from 'react-portal';
import { setTooltipActive, setTooltipInactive } from '../actions/tooltip';
import store from '../store/configureStore';

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
		const otherTooltipActive = store.getState().tooltip.active;
		if (otherTooltipActive) return;
		
		let offsetX = -5;
		let offsetY = -this.estimatedHeight - 25;
		if (e.clientX + this.estimatedWidth > window.innerWidth) {
			offsetX = -this.estimatedWidth;
		}
		if (e.clientY - this.estimatedHeight < 0) {
			offsetY = 25;
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

		if (this.props.onMouseEnter) {
			this.props.onMouseEnter();
		}
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

		if (this.props.onMouseLeave) {
			this.props.onMouseLeave();
		}
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

	renderTooltipText = () => {
		const { isVisible } = this.state;
		const TooltipText = this.props.component;
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
					<Portal>
						<div className='tooltip' style={tooltipStyle}
							onMouseEnter={this.onMouseEnterTooltipText}
							onMouseLeave={this.onMouseLeaveTooltipText}>
							<TooltipText />
						</div>
					</Portal>
				}
			</CSSTransition>
		);
	}

	render() {
		const { className, children } = this.props;
		let cls = 'tooltip-trigger';
		if (className.length > 0) {
			cls += ` ${className}`;
		}

		return (
			<React.Fragment>
				<strong
					onMouseEnter={this.onMouseEnterTooltip}
					onMouseLeave={this.onMouseLeaveTooltip}
					className={cls}>
					{children}
				</strong>
				{
					this.renderTooltipText()
				}
			</React.Fragment>
		);
	}
}

Tooltip.propTypes = {
	children: PropTypes.node.isRequired,
	component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	className: PropTypes.string,
	setTooltipActive: PropTypes.func.isRequired,
	setTooltipInactive: PropTypes.func.isRequired,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
};

Tooltip.defaultProps = {
	className: '',
	onMouseEnter: null,
	onMouseLeave: null,
};

const mapDispatchToProps = (dispatch) => ({
	setTooltipActive: () => dispatch(setTooltipActive()),
	setTooltipInactive: () => dispatch(setTooltipInactive()),
});

export default connect(
	undefined,
	mapDispatchToProps,
)(Tooltip);
