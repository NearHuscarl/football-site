import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import HeadRoom from 'react-headroom';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import { setNewsSearchQuery } from '../actions/newsFilters';
import { startSearchNews } from '../actions/newsResults';
import { history } from '../routers/AppRouter';
import logo from '../../public/images/Logo2.png';

const onSelectTab = (e) => {
	const tabName = e.key;
	history.push('/' + tabName.toLowerCase());
}

export const Header = (props) => {
	return (
		<HeadRoom>
			<div className="content-container">
				<div className="header__content">
					<div className="header__navbar">
						<Link className="header__title" to="/">
							<img alt='website logo' src={logo} width="120"></img>
							<h1>Football365</h1>
						</Link>
						<NavBar onSelectTab={onSelectTab} />
					</div>
					<SearchBar
						placeholder='Search news'
						onSubmit={(query) => {
							props.setNewsSearchQuery(query.trim());
							props.startSearchNews();
							history.push('search');
						}} />
				</div>
			</div>
		</HeadRoom>
	);
};

export const MockHeader = Header;

const mapDispatchToProps = (dispatch) => ({
	setNewsSearchQuery: (query) => dispatch(setNewsSearchQuery(query)),
	startSearchNews: () => dispatch(startSearchNews()),
});

export default connect(
	undefined,
	mapDispatchToProps,
)(Header);
