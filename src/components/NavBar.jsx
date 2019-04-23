import React from 'react';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';

const tabIconStyle = {
    left: '0',
};

const NavBar = (props) => (
    <Menu className='mainmenu'
        onSelect={props.onSelectTab}
        mode='horizontal'>
        <MenuItem key="News">
            <i className="fa fa-newspaper-o fa-fw fa-lg" style={tabIconStyle} />{' '}
            News
        </MenuItem>
        <MenuItem key="Fixtures">
            <i className="fa fa-calendar fa-fw fa-lg" style={tabIconStyle} />{' '}
            Fixtures
        </MenuItem>
        <MenuItem key="Standings">
            <i className="fa fa-list-ul fa-fw fa-lg" style={tabIconStyle} />{' '}
            Standings
        </MenuItem>
        <MenuItem key="Players">
            <i className="fa fa-user fa-fw fa-lg" style={tabIconStyle} />{' '}
            Players
        </MenuItem>
    </Menu>
);

export default NavBar;