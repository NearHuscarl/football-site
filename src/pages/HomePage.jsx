import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Headlines from '../components/Headlines';
import TileGroup from '../components/TileGroup';
import { articlePropTypes } from '../utilities/footballProptypes';

const HomePage = (props) => (
	<React.Fragment>
		<Headlines headlines={props.headlines} />
		<TileGroup />
	</React.Fragment>
)

HomePage.propTypes = {
	headlines: PropTypes.arrayOf(articlePropTypes).isRequired,
};

const mapStateToProps = (state) => ({
	headlines: state.articles.headlines,
});

export default connect(
	mapStateToProps,
	undefined,
)(HomePage);
