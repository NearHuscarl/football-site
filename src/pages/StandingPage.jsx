import React from 'react';
import { connect } from 'react-redux';
import StandingFilters from '../components/StandingFilters';
import StandingTable from '../components/StandingTable';
import Loader from '../components/Loader';
import { startSearchStanding } from '../actions/standingResult';

export class StandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.startSearchStanding();
    }

    render() {
        const { standing } = this.props;

        return (
            <div>
                <StandingFilters />
                {
                    standing.length > 0 ?
                        <div className='content-container'>
                            <StandingTable standing={this.props.standing} />
                        </div>
                        :
                        <Loader height='40vh' />
                }
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startSearchStanding: () => dispatch(startSearchStanding()),
});

const mapStateToProps = (state) => ({
    standing: state.standingResult.result,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StandingPage);