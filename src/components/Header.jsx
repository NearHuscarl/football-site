import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import HeadRoom from 'react-headroom';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import { setArticleSearchQuery } from '../actions/articleFilters';
import startSearchArticles from '../actions/articleResults';
import { history } from '../routers/AppRouter';
import logo from '../../public/images/Logo2.png';

const onSelectTab = (e) => {
	const tabName = e.key;
	history.push('/' + tabName.toLowerCase());
}

const Header = (props) => (
	<HeadRoom>
		<div className="content-container">
			<div className="header__content">
				<div className="header__navbar">
					<Link className="header__title" to="/">
						<img alt='website logo' src={logo} width="120" />
						<h1>Football365</h1>
					</Link>
					<NavBar onSelectTab={onSelectTab} />
				</div>
				<SearchBar
					placeholder='Search news'
					onSubmit={(query) => {
						props.setArticleSearchQuery(query.trim());
						props.startSearchArticles();
						history.push('search');
					}} />
			</div>
		</div>
	</HeadRoom>
);

export const MockHeader = Header;

Header.propTypes = {
	setArticleSearchQuery: PropTypes.func.isRequired,
	startSearchArticles: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
	setArticleSearchQuery: (query) => dispatch(setArticleSearchQuery(query)),
	startSearchArticles: () => dispatch(startSearchArticles()),
});

export default connect(
	undefined,
	mapDispatchToProps,
)(Header);
