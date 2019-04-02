import React from 'react';
import { Link } from 'react-router-dom';
import HeadRoom from 'react-headroom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SearchInput from './SearchInput';

const tabNames = {
	0: 'News',
	1: 'Fixtures',
	2: 'Transfers',
	3: 'Matches',
}

const Header = (props) => {

	return (
		<HeadRoom>
			<span className="header__content">
				<Link className="header__title" to="/dashboard">
					<img src='/images/Logo2.png' width="120"></img>
					<h1>Football365</h1>
				</Link>

				<Tabs defaultIndex={1} onSelect={(index) => console.log(tabNames[index])}>
					<TabList>
						<Tab><Link to={'/' + tabNames[0]}>{tabNames[0]}</Link></Tab>
						<Tab><Link to={'/' + tabNames[1]}>{tabNames[1]}</Link></Tab>
						<Tab><Link to={'/' + tabNames[2]}>{tabNames[2]}</Link></Tab>
						<Tab><Link to={'/' + tabNames[3]}>{tabNames[3]}</Link></Tab>
					</TabList>
					<TabPanel></TabPanel>
					<TabPanel></TabPanel>
					<TabPanel></TabPanel>
					<TabPanel></TabPanel>
				</Tabs>

				{/* <SearchInput onSearch={(q) => console.log('Searching ', q)}/> */}
			</span>
		</HeadRoom>
	);
};

export const MockHeader = Header;

export default Header;