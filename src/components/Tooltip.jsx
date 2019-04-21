import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Portal } from 'react-portal';
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
    }

    onMouseEnterTooltip = (e) => {
        const x = e.pageX - 5;
        const y = e.pageY - 250;
        this.setState(() => ({
            isVisible: true,
            left: x,
            top: y,
        }));
    }
    onMouseLeaveTooltip = (e) => {
        setTimeout(() => {
            if (!this.state.mouseInTooltipText) {
                this.setState(() => ({ isVisible: false }));
            }
        }, 150);
    }

    onMouseEnterTooltipText = (e) => {
        this.setState(() => ({ mouseInTooltipText: true }));
    }
    onMouseLeaveTooltipText = (e) => {
        this.setState(() => ({
            mouseInTooltipText: false,
            isVisible: false,
        }));
    }

    getTeam = () => {
        const teamId = this.props.id;
        const { teams } = store.getState();
        const competitionIds = Object.keys(teams);

        for (const competitionId of competitionIds) {
            if (teams[competitionId].hasOwnProperty(teamId)) {
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
                                    <img alt='team logo' src={team.crestUrl} />
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
                                    <a href={team.website} target='_blank'>{team.website}</a>
                                </div>
                            </div>
                        </div>
                    </Portal>
                    :
                    <div></div>
                }
            </CSSTransition>
        );
    }

    render() {
        // TODO: split into TeamTooltip
        const { props } = this;

        return (
            <React.Fragment>
                <strong
                    onMouseEnter={this.onMouseEnterTooltip}
                    onMouseLeave={this.onMouseLeaveTooltip}
                    className={'tooltip-trigger ' + props.className}>
                    {props.children}
                </strong>
                {
                    this.renderTooltipText()
                }
            </React.Fragment>
        );
    }
}

export default Tooltip;