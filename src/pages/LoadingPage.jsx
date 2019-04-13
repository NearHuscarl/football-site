import React from 'react';
import loaderGif from '../../public/images/loader.gif';

const LoadingPage = () => (
	<div className="loader">
		<img alt='loading' className="loader__image" src={loaderGif} />
	</div>
);

export default LoadingPage;
