import React from 'react';
import PropTypes from 'prop-types'
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';

const tabIconStyle = {
	left: '0',
};

const NavBar = (props) => (
	<Menu
		onSelect={props.onSelectTab}
		openAnimation='slide-up'
		mode='horizontal'>
		<MenuItem key='News'>
			<i className='fa fa-newspaper-o fa-fw fa-lg' style={tabIconStyle} />{' '}
			News
		</MenuItem>
		<MenuItem key='Fixtures'>
			<i className='fa fa-calendar fa-fw fa-lg' style={tabIconStyle} />{' '}
			Fixtures
		</MenuItem>
		<MenuItem key='Standings'>
			<i className='fa fa-list-ul fa-fw fa-lg' style={tabIconStyle} />{' '}
			Standings
		</MenuItem>
		<SubMenu key='Players'
			title={<span><i className='fa fa-user fa-fw fa-lg' style={tabIconStyle} />{' '}Player</span>}>
			<MenuItem key='Players'>
				<i className='fa fa-search fa-fw fa-lg' style={tabIconStyle} />{' '}
				Search
			</MenuItem>
			<MenuItem key='Players/top'>
				<i className='fa fa-list-ol fa-fw fa-lg' style={tabIconStyle} />{' '}
				Top
			</MenuItem>
			<MenuItem key='Players/potential'>
				<i className='fa fa-crosshairs fa-fw fa-lg' style={tabIconStyle} />{' '}
				Potential
			</MenuItem>
		</SubMenu>
	</Menu>
);

NavBar.propTypes = {
	onSelectTab: PropTypes.func.isRequired,
};

export default NavBar;