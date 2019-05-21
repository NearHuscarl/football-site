import React from 'react';
import PropTypes from 'prop-types';
import NInput from 'react-numeric-input';

const btnColor = '#666666';
const style = (width) => ({
	input: {
		height: '4rem',
		width,
	},
	btn: {
		boxShadow: 'none',
		height: '2rem',
		right: 0,
		width: '2.5rem',
		border: 'none',
	},
	'btnDown.mobile': {
		height: '4rem',
		left: 0,
		top: 0,
	},
	'btnUp.mobile': {
		height: '4rem',
	},
	btnUp: {
		top: 0,
	},
	btnBottom: {
		bottom: 0,
	},
	arrowUp: {
		borderBottomColor: btnColor,
	},
	arrowDown: {
		borderTopColor: btnColor,
	},
	plus: {
		background : btnColor,
	},
	minus: {
		background : btnColor,
	},
})

/**
 * NumericInput component unlike <input type='number' /> which can have its sub component style customized
 * Support changing value via scrolling
 */
class NumericInput extends React.Component {
	static displayName = 'NumericInputWrapper';

	constructor(props) {
		super(props);
		this.state = {
			value: Math.min(Math.max(this.props.value, this.props.min), this.props.max),
		};
		this.input = React.createRef();
		this.componentRef = React.createRef();
	}

	// Use passive = false to remove chrome error when scrolling within numeric input
	// touch-action: none; solution does not seem to work here
	// https://stackoverflow.com/questions/42101723/unable-to-preventdefault-inside-passive-event-listener
	// https://github.com/facebook/react/issues/6436#issuecomment-479454289
	componentDidMount() {
		if (this.componentRef.current) {
			this.componentRef.current.addEventListener('wheel', this.onScroll, { passive: false });
		}
	}

	componentWillUnmount() {
		if (this.componentRef.current) {
			this.componentRef.current.removeEventListener('wheel', this.onScroll);
		}
	}

	onValueChange = (newValue) => {
		// Move cursor at the end of input. This look like a mess
		// due to the quirks of a few browsers
		// https://stackoverflow.com/a/10576409/9449426
		setTimeout(() => {
			const inputRef = this.input.current.refsInput;

			inputRef.focus();
			inputRef.selectionStart = 10000;
			inputRef.selectionEnd = 10000;
		}, 1);
		this.props.onChange(newValue);
	}

	resetValue = () => {
		const value = Math.min(Math.max(this.props.value, this.props.min), this.props.max);

		this.setState(() => {
			this.onValueChange(value);
			return { value }
		});
	}

	changeValue = (offset) => {
		if (this.state.value + offset < this.props.min || this.state.value + offset > this.props.max) {
			return;
		}

		this.setState((oldState) => {
			const newValue = oldState.value + offset;
			this.onValueChange(newValue);
			return { value: newValue }
		});
	}

	onInternalValueChange = (number) => {
		// Set state directly to skip rendering wrapperred component
		// since only the inner component need to be rerendered here
		this.state.value = number;
		this.props.onChange(number);
	}

	/**
	 * 
	 * @param {WheelEvent} event 
	 */
	onScroll = (event) => {
		event.preventDefault();
		if (event.deltaY < 0) { // Zoom in
			this.changeValue(1);
		}
		else { // Zoom out
			this.changeValue(-1);
		}
	}
	
	handleKeyDown = (e) => {
		switch (e.key) {
			case 'Escape':
				this.resetValue();
				break;
			
			default:
				break;
		}
	}

	render() {
		const { value, onChange, width, ...innerProps } = this.props;

		return (
			<div ref={this.componentRef}>
				<NInput
					ref={this.input}
					onKeyDown={this.handleKeyDown}
					onChange={this.onInternalValueChange}
					value={this.state.value}
					style={style(width)}
					{...innerProps} />
			</div>
		);
	}
}

NumericInput.propTypes = {
	min: PropTypes.number,
	max: PropTypes.number,
	value: PropTypes.number,
	width: PropTypes.string,
	onChange: PropTypes.func,
};

NumericInput.defaultProps = {
	min: 0,
	max: 100,
	value: 0,
	width: '10rem',
	onChange: () => {},
};

export default NumericInput;