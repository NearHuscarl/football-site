import React from 'react';
import Tooltip from '../components/Tooltip';
import getDisplayName from '../utilities/getDisplayName';

// This component need a history props to navigate to other routes
// because it will be placed outside of the Route component which
// make routing via Link component not working
// Usecase: CustomRenderer component in ag-grid will be appended to the dom
// (outside of the Route component)
/**
 * 
 * @param {React.Component} WrappedComponent 
 */
const withHistory = (WrappedComponent) =>
	class extends WrappedComponent {
		static displayName = `WithHistory(${getDisplayName(WrappedComponent)})`;

		onClick = () => {
			const { team } = this.state;
			const { history } = this.props;

			history.push(`/team/${team.id}`)
		}

		render() {
			const { children, className } = this.props;
			const { team } = this.state;

			return (
				<Tooltip
					className={className}
					onMouseEnter={this.onMouseEnter}
					component={team ? () => this.renderTeamInfo(team) : 'span'}>
					<span
						tabIndex={-1}
						role='button'
						onKeyPress={this.onClick}
						onClick={this.onClick}>
						{children}
					</span>
				</Tooltip>
			);
		}
	}

export default withHistory;