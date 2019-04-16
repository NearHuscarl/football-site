import React from 'react';
import FixtureListFilters from '../components/FixtureListFilters';
import FixtureList from '../components/FixtureList';

const FixturesPage = () => {
    return (
        <div>
            <FixtureListFilters />
            <FixtureList />
        </div>
    );
}

export default FixturesPage;
