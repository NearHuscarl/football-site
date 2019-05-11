import React from 'react';
import { teamKitPropTypes } from '../utilities/footballProptypes';

const TeamKit = ({ kit }) => (
	<div className='card'>
		<div className='card__header'>
			<h5>Kits</h5>
		</div>
		<div className='kit-container'>
			<div className='kit-item'>
				<img alt='home kit' src={kit.home} />
				Home Kit
			</div>
			<div className='kit-item'>
				<img alt='away kit' src={kit.away} />
				Away Kit
			</div>
			<div className='kit-item'>
				<img alt='third kit' src={kit.third} />
				Third Kit
			</div>
			<div className='kit-item'>
				<img alt='goalkeeper kit' src={kit.goalkeeper} />
				Goalkeeper Kit
			</div>
		</div>
	</div>
);

TeamKit.propTypes = {
	kit: teamKitPropTypes.isRequired,
};

export default TeamKit;