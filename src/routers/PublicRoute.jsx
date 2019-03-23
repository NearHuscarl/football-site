import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';

const PublicRoute = ({ isAuthenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		component={(props) =>
			isAuthenticated ? (
				<div>
					<Header />
					<Redirect to="/dashboard" />
				</div>
			) : (
				<Component {...props} />
			)
		}
	/>
);

export const MockPublicRoute = PublicRoute;

const mapStateToProps = (state) => ({
	isAuthenticated: !!state.auth.uid,
});

export default connect(mapStateToProps)(PublicRoute);
