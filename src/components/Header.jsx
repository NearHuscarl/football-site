import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authActions from '../actions/auth';

const Header = (props) => {
	const { startLogout } = props;

	return (
		<header className="header">
			<div className="content-container">
				<div className="header__content">
					<Link className="header__title" to="/dashboard">
						<h1>Boilerplate</h1>
					</Link>
					<button
						type="button"
						className="button button--link"
						onClick={startLogout}>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
};

Header.propTypes = {
	startLogout: PropTypes.func.isRequired,
};

export const MockHeader = Header;

const mapDispatchToProps = (dispatch) => ({
	startLogout: () => dispatch(authActions.startLogout()),
});

export default connect(
	undefined,
	mapDispatchToProps,
)(Header);
