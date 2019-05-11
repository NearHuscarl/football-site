import React from 'react';
import moment from 'moment';
import Image from './Image';
import TooltipTeam from './TooltipTeam';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import { matchPropTypes, teamPropTypes } from '../utilities/footballProptypes';

const FixtureListItem = ({ fixture, homeTeam, awayTeam }) => {
	const date = moment.utc(fixture.utcDate).format('HH:mm');

	return (
		<div className='fixturelist-item' key={fixture.id}>
			<TooltipTeam className='fixture-item__logo' id={homeTeam.id}>
				<Image alt='home team' src={homeTeam.crestUrl} defaultImage={defaultLogo} />
			</TooltipTeam>
			<div className='fixture-item__info'>
				<span className='fixture-item__team vertical-align flex-right'>
					{homeTeam.name}
				</span>
				<span className='fixture-item__vs'>
					{
						fixture.status === 'SCHEDULED' ?
							date
							:
							`${fixture.score.fullTime.homeTeam} - ${fixture.score.fullTime.awayTeam}`
					}
				</span>
				<span className='fixture-item__team vertical-align flex-left'>
					{awayTeam.name}
				</span>
			</div>
			<TooltipTeam className='fixture-item__logo' id={awayTeam.id}>
				<Image alt='away team' src={awayTeam.crestUrl} defaultImage={defaultLogo} />
			</TooltipTeam>
		</div>
	);
}

FixtureListItem.propTypes = {
	fixture: matchPropTypes.isRequired,
	homeTeam: teamPropTypes.isRequired,
	awayTeam: teamPropTypes.isRequired,
};

export default FixtureListItem;