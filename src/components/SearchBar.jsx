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

    search = () => {
        this.props.onSubmit(this.state.value.trim());
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
                    className='text-input'
                    type="text"
                    placeholder={props.placeholder}
                    onChange={this.onChange}
                    value={state.value}
                    onKeyDown={this.handleKeyDown} />
                <div className='search-bar__submit'>
                    <button
                        aria-label='Search'
                        className={props.buttonClassName}
                        onClick={this.search}>
                        <i className="fa fa-search fa-fw fa-sm" />
                    </button>
                </div>
            </div>
        );
    }
}

SearchBar.propTypes = {
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
    renderSearchButton: PropTypes.bool,
    buttonClassName: PropTypes.string,
};

SearchBar.defaultProps = {
    placeholder: 'Search...',
    onSearch: (q) => console.log('Searching', q),
    renderSearchButton: true,
    buttonClassName: 'button button--icon button--yellow button--search',
};

export default SearchBar
