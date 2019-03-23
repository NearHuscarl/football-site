import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as authActions from '../actions/auth';

const LoginPage = (props) => {
	const {
		startLoginWithGoogle,
		startLoginWithFacebook,
		startLoginWithTwitter,
		startLoginWithGithub,
	} = props;

	return (
		<div className="box-layout">
			<div className="box-layout__box">
				<h1 className="box-layout__title">Boilerplate</h1>
				<p>Tag line for app.</p>
				<button
					type="button"
					className="box-layout__button button--red"
					onClick={startLoginWithGoogle}>
					<i className="fa fa-google fa-fw" />
					Login with Google
				</button>
				<button
					type="button"
					className="box-layout__button"
					onClick={startLoginWithFacebook}>
					<i className="fa fa-facebook fa-fw" />
					Login with Facebook
				</button>
				<button
					type="button"
					className="box-layout__button button--light-blue"
					onClick={startLoginWithTwitter}>
					<i className="fa fa-twitter fa-fw" />
					Login with Twitter
				</button>
				<button
					type="button"
					className="box-layout__button button--dark"
					onClick={startLoginWithGithub}>
					<i className="fa fa-github fa-fw" />
					Login with Github
				</button>
			</div>
		</div>
	);
};

LoginPage.propTypes = {
	startLoginWithGoogle: PropTypes.func.isRequired,
	startLoginWithFacebook: PropTypes.func.isRequired,
	startLoginWithTwitter: PropTypes.func.isRequired,
	startLoginWithGithub: PropTypes.func.isRequired,
};

export const MockLoginPage = LoginPage;

const mapDispatchToProps = (dispatch) => ({
	startLoginWithGoogle: () => dispatch(authActions.startLoginWithGoogle()),
	startLoginWithFacebook: () => dispatch(authActions.startLoginWithFacebook()),
	startLoginWithTwitter: () => dispatch(authActions.startLoginWithTwitter()),
	startLoginWithGithub: () => dispatch(authActions.startLoginWithGithub()),
});

export default connect(
	undefined,
	mapDispatchToProps,
)(LoginPage);
