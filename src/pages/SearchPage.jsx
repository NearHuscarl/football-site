import React from 'react';
import NewsListFilters from '../components/NewsListFilters';
import NewsListSearch from '../components/NewsListSearch';

export const SearchPage = () => {
    return (
        <div>
            <NewsListFilters />
            <NewsListSearch />
        </div>
    );
}

export default SearchPage;
