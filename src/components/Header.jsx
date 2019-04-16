import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import HeadRoom from 'react-headroom';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import { setNewsTextFilter } from '../actions/newsFilters';
import { startSearchNews } from '../actions/newsResults';
import { history } from '../routers/AppRouter';
import logo from '../../public/images/Logo2.png';

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
						<NavBar history={history} />
					</div>
					<SearchBar
						placeholder='Search news'
						onSubmit={(query) => {
							props.setNewsTextFilter(query.trim());
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
	setNewsTextFilter: (text) => dispatch(setNewsTextFilter(text)),
	startSearchNews: () => dispatch(startSearchNews()),
});

export default connect(
	undefined,
	mapDispatchToProps,
)(Header);
