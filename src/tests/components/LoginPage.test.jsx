import React from 'react';
import { shallow } from 'enzyme';
import { MockLoginPage } from '../../components/LoginPage';

let wrapper;
let startLoginWithGoogle;
let startLoginWithFacebook;
let startLoginWithTwitter;
let startLoginWithGithub;

beforeAll(() => {
	startLoginWithGoogle = jest.fn();
	startLoginWithFacebook = jest.fn();
	startLoginWithTwitter = jest.fn();
	startLoginWithGithub = jest.fn();
	wrapper = shallow(
		<MockLoginPage
			startLoginWithGoogle={startLoginWithGoogle}
			startLoginWithFacebook={startLoginWithFacebook}
			startLoginWithTwitter={startLoginWithTwitter}
			startLoginWithGithub={startLoginWithGithub}
		/>,
	);
});

test('should render LoginPage correctly', () => {
	expect(wrapper).toMatchSnapshot();
});

test('should call startLoginWithGoogle on button click', () => {
	wrapper
		.findWhere(
			(n) => n.text() === 'Login with Google' && n.type() === 'button',
		)
		.simulate('click');
	expect(startLoginWithGoogle).toHaveBeenCalled();
});

test('should call startLoginWithFacebook on button click', () => {
	wrapper
		.findWhere(
			(n) => n.text() === 'Login with Facebook' && n.type() === 'button',
		)
		.simulate('click');
	expect(startLoginWithFacebook).toHaveBeenCalled();
});

test('should call startLoginWithTwitter on button click', () => {
	wrapper
		.findWhere(
			(n) => n.text() === 'Login with Twitter' && n.type() === 'button',
		)
		.simulate('click');
	expect(startLoginWithTwitter).toHaveBeenCalled();
});

test('should call startLoginWithGithub on button click', () => {
	wrapper
		.findWhere(
			(n) => n.text() === 'Login with Github' && n.type() === 'button',
		)
		.simulate('click');
	expect(startLoginWithGithub).toHaveBeenCalled();
});
