import React from 'react';
import { shallow } from 'enzyme';
import { MockHeader } from '../../components/Header';

test('should render Header correctly', () => {
	const wrapper = shallow(<MockHeader startLogout={() => {}} />);
	expect(wrapper).toMatchSnapshot();
});

test('should call startLogout on button click', () => {
	const startLogout = jest.fn();
	const wrapper = shallow(<MockHeader startLogout={startLogout} />);
	wrapper.find('button').simulate('click');
	expect(startLogout).toHaveBeenCalled();
});
