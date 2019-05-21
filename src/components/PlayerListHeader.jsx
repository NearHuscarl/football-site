import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import compact from 'lodash/compact';
import upperFirst from 'lodash/upperFirst';

const EUR = '€';
const USD = '$';

// '$157K' => '€139K'
// '87kg' => '..ft'
const unitConverter = (str, currentUnit, nextUnit, coefficient) => {
	const pieces = compact(str.split(/(\$|K|M)/i));

	return pieces.map((piece) => {
		if (!Number.isNaN(Number(piece))) {
			return (piece * coefficient).toFixed(1);
		}
		if (piece === currentUnit) {
			return nextUnit;
		}
		return piece;
	}).join('');
}

/**
 * 
 * @returns {{
 * 	name: string,
 * 	coefficient: number,
 * }[]}  
 */
const getAllUnits = (type) => {
	if (type === 'currency') {
		return [{ name: USD, coefficient: 1 }, { name: EUR, coefficient: 0.89 }]; // TODO: use currency converter library
	} if (type === 'height') {
		return [{ name: 'm', coefficient: 1 }, { name: 'ft', coefficient: 3.28084 }];
	} if (type === 'weight') {
		return [{ name: 'kg', coefficient: 1 }, { name: 'lbs', coefficient: 2.204623 }];
	}
	return [];
}

const getInitialUnit = (type) => {
	const allUnits = getAllUnits(type);
	if (allUnits.length > 0) {
		return allUnits[0].name;
	}
	return '';
}

class PlayerListHeader extends React.Component {
	constructor(props) {
		super(props);
		this.sortMode = ['none', 'asc', 'desc'];
		this.currentSortIndex = 0;
		this.state = {
			sort: this.sortMode[this.currentSortIndex],
			unit: getInitialUnit(this.getHeaderType()),
		};

		this.units = getAllUnits(this.getHeaderType());
	}

	getHeaderType = () => {
		const { field } = this.props.column.colDef;

		if (field === 'value' || field === 'wage') {
			return 'currency';
		} if (field === 'height') {
			return 'height';
		} if (field === 'weight') {
			return 'weight';
		}
		return '';
	}

	/**
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event 
	 */
	onSortRequested = (event) => {
		this.currentSortIndex += 1;
		if (this.currentSortIndex >= this.sortMode.length) {
			this.currentSortIndex = 0;
		}

		this.setState(() => ({ sort: this.sortMode[this.currentSortIndex] }))
		this.props.progressSort(event.shiftKey);
	}

	/**
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event 
	 */
	onChangeUnit = (event) => {
		event.stopPropagation();

		const { field } = this.props.column.colDef;
		const originField = 'origin' + upperFirst(field);
		const itemsToUpdate = [];
		const currentUnit = this.state.unit;
		const unitNames = this.units.map((unit) => unit.name);
		let nextUnitIndex = unitNames.indexOf(currentUnit) + 1;
		nextUnitIndex = nextUnitIndex === this.units.length ? 0 : nextUnitIndex;
		const nextUnit = unitNames[nextUnitIndex];
		this.setState(() => ({ unit: nextUnit }));

		this.props.api.forEachNodeAfterFilterAndSort((rowNode) => {
			const { data } = rowNode;

			if (!has(data, originField)) {
				data[originField] = data[field];
				data.originUnit = currentUnit;
			}

			const { originUnit } = data;
			const originValue = data[originField];

			if (nextUnit === originUnit) {
				data[field] = originValue;
			} else {
				data[field] = unitConverter(originValue, currentUnit, nextUnit, this.units[nextUnitIndex].coefficient);
			}
			itemsToUpdate.push(data);
		});

		this.props.api.updateRowData({ update: itemsToUpdate });
	}

	getSortIndicator = () => {
		const { sort } = this.state;
		if (sort === 'asc') {
			return (<span>{' '}<i className='fa fa-long-arrow-up' /></span>);
		}
		if (sort === 'desc') {
			return (<span>{' '}<i className='fa fa-long-arrow-down' /></span>);
		}
		return null;
	}

	render() {
		const { unit } = this.state;

		return (
			<div style={{ fontFamily: 'Quicksand-Regular' }}
				tabIndex={-1}
				onClick={this.onSortRequested}
				onKeyPress={this.onSortRequested}
				role='button'>
				{this.props.displayName}
				{this.getHeaderType() &&
					<span>{' '}
						<button
							type='button'
							onClick={this.onChangeUnit}
							className='button button--link-cyan'>{unit}</button>
					</span>
				}
				{this.getSortIndicator()}
			</div>
		);
	}
}

PlayerListHeader.propTypes = {
	column: PropTypes.shape({
		colDef: PropTypes.object,
	}).isRequired,
	api: PropTypes.objectOf(PropTypes.object).isRequired,
	progressSort: PropTypes.func.isRequired,
	displayName: PropTypes.string.isRequired,
};


export default PlayerListHeader;