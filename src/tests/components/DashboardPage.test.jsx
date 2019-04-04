import React from 'react';
import { shallow } from 'enzyme';
import HomePage from '../../components/HomePage';

test('should render HomePage correctly', () => {
	const wrapper = shallow(<HomePage />);
	expect(wrapper).toMatchSnapshot();
});
