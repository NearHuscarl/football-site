const tooltipDefaultState = {
	active: false,
};

const tooltipReducer = (state = tooltipDefaultState, action) => {
	switch (action.type) {
		case 'TOOLTIP_ACTIVE': {
			return { active: true };
		}
		case 'TOOLTIP_INACTIVE': {
			return { active: false };
		}
		default:
			return state;
	}
};

export default tooltipReducer;
