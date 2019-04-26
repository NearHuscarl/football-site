import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Image from './Image';
import Tooltip from './Tooltip';
import defaultLogo from '../../public/images/Default_Team_Logo.png';

const FixtureListItem = ({ fixture, homeTeam, awayTeam }) => {
	const date = moment.utc(fixture.utcDate).format('HH:mm');

	return (
		<div className='fixturelist-item' key={fixture.id}>
			<div className='fixture-item__logo' >
				<Tooltip id={homeTeam.id}>
					<Image alt='home team' src={homeTeam.crestUrl} defaultImage={defaultLogo} />
				</Tooltip>
			</div>
			<div className='fixture-item__info'>
				<span className='fixture-item__team-home'>
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
				<span className='fixture-item__team-away'>
					{awayTeam.name}
				</span>
			</div>
			<div className='fixture-item__logo' >
				<Tooltip id={awayTeam.id}>
					<Image alt='away team' src={awayTeam.crestUrl} defaultImage={defaultLogo} />
				</Tooltip>
			</div>
		</div>
	);
}

FixtureListItem.propTypes = {
	fixture: PropTypes.shape({
		id: PropTypes.number,
		status: PropTypes.string,
		utcDate: PropTypes.string,
		score: PropTypes.object,
	}).isRequired,

	homeTeam: PropTypes.shape({
		name: PropTypes.string,
		crestUrl: PropTypes.string,
	}).isRequired,
	
	awayTeam: PropTypes.shape({
		name: PropTypes.string,
		crestUrl: PropTypes.string,
	}).isRequired,
};

export default FixtureListItem;