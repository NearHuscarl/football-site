import React from 'react';
import { shallow } from 'enzyme';
import ConfirmModal from '../../components/ConfirmModal';

test('should render ConfirmModal correctly', () => {
	const wrapper = shallow(
		<ConfirmModal
			isOpen={false}
			prompt="are you sure?"
			onConfirm={jest.fn()}
			onCancel={jest.fn()}
		/>,
	);
	expect(wrapper).toMatchSnapshot();
});
