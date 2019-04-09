const fixturesDefaultState = {};

const fixturesReducer = (state = fixturesDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIXTURE':
            return action.fixtures;
        default:
            return state;
    }
}

export default fixturesReducer;