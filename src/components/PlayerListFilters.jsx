import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';
import get from 'lodash/get';
import SearchBar from './SearchBar';
import PageHeader from './PageHeader';
import NumericInput from './NumericInput';
import SelectOptions from './SelectOptions';
import Position from './Position';
import StarRating from './StarRating';
import {
	setPlayerFilterType,
	setPlayerSearchQuery,
	setPlayerNationality,
	setPlayerTeam,
	setPlayerPosition,
	setPlayerMinRating,
	setPlayerMaxRating,
	setPlayerMinPotentialRating,
	setPlayerMaxPotentialRating,
	setPlayerMinAge,
	setPlayerMaxAge,
	setPlayerPreferredFoot,
	setPlayerReputation,
	setPlayerSkillMoves,
	setPlayerWeakFoot,
} from '../actions/playerFilters';
import startSearchPlayers from '../actions/playerResults';
import nationalities from '../utilities/nationalities';
import positions from '../utilities/positions';
import { player } from '../settings';
import { competitionModelPropTypes } from '../utilities/footballProptypes';
import playerFiltersPropTypes from '../utilities/playerFiltersProptypes';
import trimTeamName from '../utilities/trimTeamName';

const filterTypes = ['General', 'Age', 'Overall Rating', 'Potential'];
const starOptions = [1, 2, 3, 4, 5];

class PlayerListFilters extends React.Component {
	onSubmit = (query) => {
		this.props.setPlayerSearchQuery(query.trim());
		this.props.startSearchPlayers();
	}

	getOption = (option, labelPath = '', valuePath = '') =>
		(option && option !== -1) ?
			({
				label: (labelPath === '') ? option : get(option, labelPath),
				value: (valuePath === '') ? option : get(option, valuePath),
			})
			:
			null

	getOptions = (sources, labelPath = '', valuePath = '') => {
		return sources.map((source) => this.getOption(source, labelPath, valuePath));
	}

	getTeamOptions = () => {
		const groupOptions = [];
		const { competitions } = this.props;

		Object.keys(competitions).forEach((competitionId) => {
			const competition = competitions[competitionId];
			const options = [];
			
			Object.keys(competition.teams).forEach((teamId) => {
				options.push({
					label: trimTeamName(competition.teams[teamId].name),
					value: Number(teamId),
				});
			});

			groupOptions.push({
				label: competition.name,
				options,
			});
		});

		return groupOptions;
	}

	setOption = (fn, defaultValue, valueProp = '', labelProp = '') => (option) => {
		let val = {};
		if (option === null) {
			val = defaultValue;
		} else {
			if (valueProp) {
				val[valueProp] = option.value;
			}
			if (labelProp) {
				val[labelProp] = option.label;
			}
			if (!labelProp && !valueProp) {
				val = option.value;
			}
		}
		fn(val);
	}

	setNumericOption = (fn) => (value) => fn(value)

	positionOption = (props) => {
		const { children, className, cx, getStyles, isDisabled, isFocused, isSelected, innerRef, innerProps } = props;
		return (
			<div
				ref={innerRef}
				className={cx(
					css(getStyles('option', props)),
					{
						'option': true,
						'option--is-disabled': isDisabled,
						'option--is-focused': isFocused,
						'option--is-selected': isSelected,
					},
					className
				)}
				{...innerProps}>
				<Position>{children}</Position>
			</div>
		)
	}

	starOption = (props) => {
		const { children, className, cx, getStyles, isDisabled, isFocused, isSelected, innerRef, innerProps } = props;
		return (
			<span
				ref={innerRef}
				className={cx(
					css(getStyles('option', props)),
					{
						'option': true,
						'option--is-disabled': isDisabled,
						'option--is-focused': isFocused,
						'option--is-selected': isSelected,
					},
					className
				)}
				{...innerProps}>
				<StarRating score={children} />
			</span>
		)
	}

	renderSearchBar = () => {
		const { isSearching } = this.props;

		return (
			<div className="input-group__item">
				<SearchBar
					onSubmit={this.onSubmit}
					buttonClassName='button button--icon button--blue button--search'
					loading={isSearching}
				/>
			</div>
		)
	}

	renderGeneralFilters = () => {
		const {
			nationality,
			team,
			position,
			preferredFoot,
			reputation,
			skillMoves,
			weakFoot,
		} = this.props.filters;

		return (
			<React.Fragment>
				<div className="input-group">
					{this.renderSearchBar()}
					<div className="input-group__item">
						<SelectOptions
							onChange={this.setOption(this.props.setPlayerNationality, '')}
							options={this.getOptions(nationalities)}
							defaultValue={this.getOption(nationality)}
							placeholder='Nationality'
							width='17rem'
							singleLineOption
							virtualized
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							onChange={this.setOption(this.props.setPlayerTeam, { id: null }, 'id', 'name')}
							options={this.getTeamOptions()}
							defaultValue={team.id ? { value: team.id, label: team.name } : null}
							placeholder='Team'
							width='25rem'
							menuHeight='45rem'
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							components={{ Option: this.positionOption }}
							onChange={this.setOption(this.props.setPlayerPosition, '')}
							options={this.getOptions(positions)}
							defaultValue={this.getOption(position)}
							placeholder='Position'
							width='12rem'
							menuHeight='45rem'
						/>
					</div>
				</div>
				<div className="input-group">
					<div className="input-group__item">
						<SelectOptions
							onChange={this.setOption(this.props.setPlayerPreferredFoot, '')}
							options={this.getOptions(['Left', 'Right'])}
							defaultValue={this.getOption(preferredFoot)}
							placeholder='Preferred Foot'
							width='17rem'
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							components={{ Option: this.starOption }}
							onChange={this.setOption(this.props.setPlayerReputation, -1)}
							options={this.getOptions(starOptions)}
							defaultValue={this.getOption(reputation)}
							placeholder='Reputation'
							width='14rem'
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							components={{ Option: this.starOption }}
							onChange={this.setOption(this.props.setPlayerSkillMoves, -1)}
							options={this.getOptions(starOptions)}
							defaultValue={this.getOption(skillMoves)}
							placeholder='Skill Moves'
							width='14rem'
						/>
					</div>
					<div className="input-group__item">
						<SelectOptions
							components={{ Option: this.starOption }}
							onChange={this.setOption(this.props.setPlayerWeakFoot, -1)}
							options={this.getOptions(starOptions)}
							defaultValue={this.getOption(weakFoot)}
							placeholder='Weak Foot'
							width='14rem'
						/>
					</div>
				</div>
			</React.Fragment>
		)
	}

	renderAgeFilters = () => {
		const {
			minAge,
			maxAge,
		} = this.props.filters;

		return (
			<React.Fragment>
				<div className="input-group">
					{this.renderSearchBar()}
					<div className="input-group__item">
						<span>Min Age</span>
						<NumericInput
							onChange={this.setNumericOption(this.props.setPlayerMinAge)}
							min={player.minAge}
							max={player.maxAge}
							value={minAge} />
					</div>
					<div className="input-group__item">
						<span>Max Age</span>
						<NumericInput
							onChange={this.setNumericOption(this.props.setPlayerMaxAge)}
							min={player.minAge}
							max={player.maxAge}
							value={maxAge} />
					</div>
				</div>
			</React.Fragment>
		)
	}

	renderRatingFilters = () => {
		const {
			minRating,
			maxRating,
		} = this.props.filters;

		return (
			<React.Fragment>
				<div className="input-group">
					{this.renderSearchBar()}
					<div className="input-group__item">
						<span>Min Rating</span>
						<NumericInput
							onChange={this.setNumericOption(this.props.setPlayerMinRating)}
							min={player.minRating}
							max={player.maxRating}
							value={minRating} />
					</div>
					<div className="input-group__item">
						<span>Max Rating</span>
						<NumericInput
							onChange={this.setNumericOption(this.props.setPlayerMaxRating)}
							min={player.minRating}
							max={player.maxRating}
							value={maxRating} />
					</div>
				</div>
			</React.Fragment>
		)
	}

	renderPotentialFilters = () => {
		const {
			minPotential,
			maxPotential,
		} = this.props.filters;

		return (
			<React.Fragment>
				<div className="input-group">
					{this.renderSearchBar()}
					<div className="input-group__item">
						<span>Min Potential</span>
						<NumericInput
							onChange={this.setNumericOption(this.props.setPlayerMinPotentialRating)}
							min={player.minRating}
							max={player.maxRating}
							value={minPotential} />
					</div>
					<div className="input-group__item">
						<span>Max Potential</span>
						<NumericInput
							onChange={this.setNumericOption(this.props.setPlayerMaxPotentialRating)}
							min={player.minRating}
							max={player.maxRating}
							value={maxPotential} />
					</div>
				</div>
			</React.Fragment>
		)
	}

	renderFilters = (type) => {
		switch (type) {
			case 'General':
				return this.renderGeneralFilters();
			case 'Age':
				return this.renderAgeFilters();
			case 'Overall Rating':
				return this.renderRatingFilters();
			case 'Potential':
				return this.renderPotentialFilters();
			default:
				return null;
		}
	}

	render() {
		const { filterType } = this.props.filters;

		return (
			<PageHeader>
				<div className="input-group">
					<div className="input-group__item">
						<SelectOptions
							onChange={this.setOption(this.props.setPlayerFilterType, 'General')}
							options={this.getOptions(filterTypes)}
							defaultValue={this.getOption(filterType)}
							placeholder='Filter Type'
							width='20rem'
						/>
					</div>
				</div>
				{this.renderFilters(filterType)}
			</PageHeader>
		);
	}
}

export const MockPlayerListFilters = PlayerListFilters;

PlayerListFilters.propTypes = {
	isSearching: PropTypes.bool.isRequired,
	filters: playerFiltersPropTypes.isRequired,
	competitions: competitionModelPropTypes.isRequired,
	setPlayerFilterType: PropTypes.func.isRequired,
	setPlayerSearchQuery: PropTypes.func.isRequired,
	setPlayerNationality: PropTypes.func.isRequired,
	setPlayerTeam: PropTypes.func.isRequired,
	setPlayerPosition: PropTypes.func.isRequired,
	setPlayerMinRating: PropTypes.func.isRequired,
	setPlayerMaxRating: PropTypes.func.isRequired,
	setPlayerMinPotentialRating: PropTypes.func.isRequired,
	setPlayerMaxPotentialRating: PropTypes.func.isRequired,
	setPlayerMinAge: PropTypes.func.isRequired,
	setPlayerMaxAge: PropTypes.func.isRequired,
	setPlayerPreferredFoot: PropTypes.func.isRequired,
	setPlayerReputation: PropTypes.func.isRequired,
	setPlayerSkillMoves: PropTypes.func.isRequired,
	setPlayerWeakFoot: PropTypes.func.isRequired,
	startSearchPlayers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	isSearching: state.players.pending && state.players.mode === 'search',
	competitions: state.competitions.models,
});

const mapDispatchToProps = (dispatch) => ({
	setPlayerFilterType: (filterType) => dispatch(setPlayerFilterType(filterType)),
	setPlayerSearchQuery: (query) => dispatch(setPlayerSearchQuery(query)),
	setPlayerNationality: (nationality) => dispatch(setPlayerNationality(nationality)),
	setPlayerTeam: (team) => dispatch(setPlayerTeam(team)),
	setPlayerPosition: (position) => dispatch(setPlayerPosition(position)),
	setPlayerMinRating: (rating) => dispatch(setPlayerMinRating(rating)),
	setPlayerMaxRating: (rating) => dispatch(setPlayerMaxRating(rating)),
	setPlayerMinPotentialRating: (rating) => dispatch(setPlayerMinPotentialRating(rating)),
	setPlayerMaxPotentialRating: (rating) => dispatch(setPlayerMaxPotentialRating(rating)),
	setPlayerMinAge: (age) => dispatch(setPlayerMinAge(age)),
	setPlayerMaxAge: (age) => dispatch(setPlayerMaxAge(age)),
	setPlayerPreferredFoot: (preferredFoot) => dispatch(setPlayerPreferredFoot(preferredFoot)),
	setPlayerReputation: (reputation) => dispatch(setPlayerReputation(reputation)),
	setPlayerSkillMoves: (skillMoves) => dispatch(setPlayerSkillMoves(skillMoves)),
	setPlayerWeakFoot: (weakFoot) => dispatch(setPlayerWeakFoot(weakFoot)),
	startSearchPlayers: () => dispatch(startSearchPlayers()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PlayerListFilters);
