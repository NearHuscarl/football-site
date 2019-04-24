import React from 'react';
import NewsListFilters from '../components/NewsListFilters';
import NewsListSearch from '../components/NewsListSearch';

export const SearchPage = () => (
	<div>
		<NewsListFilters />
		<NewsListSearch />
	</div>
)

export default SearchPage;
