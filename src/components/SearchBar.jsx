import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/_searchbar.scss';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }

    onChange = (e) => {
        let { value } = e.target;
        this.setState({ value });
    }

    search = (query) => {
        this.props.onSearch(this.state.value.trim());
    }

    handleKeyDown = (e) => {
        switch (e.key) {
            case 'Enter':
                this.search();
                break;

            case 'Escape':
                this.handleEscape();
                break;
        }
    }

    handleEscape = () => {

    }

    render() {
        const { props, state } = this;

        return (
            <div className='search-bar__wrapper'>
                <label htmlFor='search-input'>
                    Search bar
                </label>
                <input id="search-input"
                        type="text"
                        placeholder={props.placeholder}
                        onChange={this.onChange}
                        value={state.value}
                        onKeyDown={this.handleKeyDown} />
                <button
                    aria-label='Search'
                    className='button--yellow search-bar__submit'
                    onClick={this.search}>
                    <i className="fa fa-search fa-fw fa-sm" />
                </button>
            </div>
        );
    }
}

SearchBar.propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    renderSearchButton: PropTypes.bool,
};

SearchBar.defaultProps = {
    placeholder: 'Searching...',
    onSearch: (q) => console.log('Searching', q),
    renderSearchButton: true,
};

export default SearchBar
