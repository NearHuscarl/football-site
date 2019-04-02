import React from 'react';
import { Link } from 'react-router-dom';
import HeadRoom from 'react-headroom';
import NavBar from './NavBar';
import SearchBar from './SearchBar';

const Header = (props) => {
	return (
		<HeadRoom>
			<span className="header__content">
				<Link className="header__title" to="/">
					<img src='/images/Logo2.png' width="120"></img>
					<h1>Football365</h1>
				</Link>
				<NavBar history={props.history}/>
				<SearchBar onSearch={(q) => console.log('Searching ', q)}/>
			</span>
		</HeadRoom>
	);
};

export const MockHeader = Header;

export default Header;