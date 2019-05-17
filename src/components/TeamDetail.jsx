import React from 'react';
import StarRating from './StarRating';
import Rating from './Rating';
import TooltipTeam from './TooltipTeam';
import { teamPropTypes } from '../utilities/footballProptypes';

const getStarting11AverageAge = (team) => {
	const starting11 = team.squad.filter((player) => player.role === 'Starting');
	const totalAge = starting11.reduce((prevAge, player) => prevAge + player.age, 0);
	return (totalAge / starting11.length).toFixed(2);
}

const getWholeTeamAverageAge = (team) => {
	const totalAge = team.squad.reduce((prevAge, player) => prevAge + player.age, 0);
	return (totalAge / team.squad.length).toFixed(2);
}

const renderTeamSummary = (team) => (
	<div className='card'>
		<div className='card__header'>
			<h5>Summary</h5>
		</div>
		<ul>
			<li>
				<span className='bold'>Code:</span>{' '}{team.tla}
			</li>
			<li>
				<span className='bold'>Area:</span>{' '}{team.area.name}
			</li>
			<li>
				<span className='bold'>Competition:</span>{' '}{team.competition.name}
			</li>
			<li>
				<span className='bold'>Rival Team:</span>{' '}
				<TooltipTeam id={team.rivalTeam.id}>{team.rivalTeam.name}</TooltipTeam>
			</li>
			<li>
				<span className='bold'>Club color:</span>{' '}{team.clubColors}
			</li>
			<li>
				<span className='bold'>Founded:</span>{' '}{team.founded}
			</li>
			<li>
				<span className='bold'>Venue:</span>{' '}{team.venue}
			</li>
		</ul>
	</div>
)

const renderTeamStats = (team) => (
	<div className='card'>
		<div className='card__header'>
			<h5>Statistics</h5>
		</div>
		<ul>
			<li>
				<span className='bold'>Overall:</span>{' '}<Rating>{team.overall}</Rating>
			</li>
			<li>
				<span className='bold'>Attack:</span>{' '}<Rating>{team.attack}</Rating>
			</li>
			<li>
				<span className='bold'>Midfield:</span>{' '}<Rating>{team.midfield}</Rating>
			</li>
			<li>
				<span className='bold'>Defence:</span>{' '}<Rating>{team.defence}</Rating>
			</li>
			<li>
				<span className='bold'>Transfer Budget:</span>{' '}{team.transferBudget}
			</li>
			<li>
				<span className='bold'>Starting 11 Average Age:</span>{' '}{getStarting11AverageAge(team)}
			</li>
			<li>
				<span className='bold'>Whole team Average Age:</span>{' '}{getWholeTeamAverageAge(team)}
			</li>
			<li>
				<span className='bold'>Domestic Prestige:</span>{' '}
				<StarRating score={team.domesticPrestige} maxScore={10} />
			</li>
			<li>
				<span className='bold'>International Prestige:</span>{' '}
				<StarRating score={team.internationalPrestige} maxScore={10} />
			</li>
		</ul>
	</div>
)

const renderTeamContact = (contact) => (
	<div className='card'>
		<div className='card__header'>
			<h5>Contact</h5>
		</div>
		<ul>
			<li>
				<span className='bold'>Address:</span>{' '}{contact.address}
			</li>
			<li>
				<span className='bold'>Email:</span>{' '}
				<button
					type='button'
					className='button button--link-red'
					onClick={() => window.open(`mailto:${contact.email}`)}>{contact.email}</button>
			</li>
			<li>
				<span className='bold'>Phone:</span>{' '}{contact.phone}
			</li>
			<li>
				<span className='bold'>Fax:</span>{' '}{contact.fax}
			</li>
			<li>
				<span className='bold'>Website:</span>{' '}
				<a href={contact.website} target='_blank' rel='noreferrer noopener'>{contact.website}</a>
			</li>
		</ul>
	</div>
)

const TeamDetail = ({ team }) => (
	<React.Fragment>
		{renderTeamSummary(team)}
		<div className='sep' />
		{renderTeamStats(team)}
		<div className='sep' />
		{renderTeamContact(team.contact)}
	</React.Fragment>
);

TeamDetail.propTypes = {
	team: teamPropTypes.isRequired,
};

export default TeamDetail;