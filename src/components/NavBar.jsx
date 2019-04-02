import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tabNames: {
                0: 'News',
                1: 'Fixtures',
                2: 'Transfers',
                3: 'Matches',
            },
        }
    }

    onSelectTab = (index) => {
        const { history } = this.props;
        const { tabNames } = this.state;
        const tabName = tabNames[index];
        console.log(tabName);
        history.push('/' + tabName);
    }

    render() {
        const { tabNames } = this.state;

        return (
            <Tabs defaultIndex={1} onSelect={this.onSelectTab}>
                <TabList>
                    <Tab>{tabNames[0]}</Tab>
                    <Tab>{tabNames[1]}</Tab>
                    <Tab>{tabNames[2]}</Tab>
                    <Tab>{tabNames[3]}</Tab>
                </TabList>
                <TabPanel></TabPanel>
                <TabPanel></TabPanel>
                <TabPanel></TabPanel>
                <TabPanel></TabPanel>
            </Tabs>
        );
    }
}

export default NavBar;