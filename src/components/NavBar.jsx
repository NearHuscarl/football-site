import React from 'react';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';

const tabIconStyle = {
    left: '0',
    marginLeft: '0',
    marginRight: '1rem',
};

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }
        
    onSelectTab = (e) => {
        const { history } = this.props;
        const tabName = e.key;
        history.push('/' + tabName);
    }

    render() {
        return (
            <Menu className='mainmenu'
                onSelect={this.onSelectTab}
                mode='horizontal'>
                <MenuItem key="News">
                    <i className="fa fa-newspaper-o fa-fw fa-lg" style={tabIconStyle}/>
                    News
                </MenuItem>
                <MenuItem key="Fixtures">
                    <i className="fa fa-calendar fa-fw fa-lg" style={tabIconStyle}/>
                    Fixtures
                </MenuItem>
                <MenuItem key="Standings">
                    <i className="fa fa-list-ul fa-fw fa-lg" style={tabIconStyle}/>
                    Standings
                </MenuItem>
                <MenuItem key="Players">
                    <i className="fa fa-user fa-fw fa-lg" style={tabIconStyle}/>
                    Players
                </MenuItem>
            </Menu>
        );
    }
}

export default NavBar;