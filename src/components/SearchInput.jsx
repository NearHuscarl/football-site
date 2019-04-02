import React from 'react';
import PropTypes from 'prop-types';

class SearchInput extends React.Component {
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
        switch (event.key) {
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
            <div className={props.styles.wrapper}>
                <input
                    type="text"
                    className={props.styles.input}
                    placeholder={props.placeholder}
                    onChange={this.onChange}
                    value={state.value}
                    onKeyDown={this.handleKeyDown}
                />
                <button
                    className={props.styles.submitButton}
                    onClick={this.search}
                />
            </div>
        );
    }
}

SearchInput.propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    renderSearchButton: PropTypes.bool,
    styles: PropTypes.object,
};

SearchInput.defaultProps = {
    placeholder: 'Searching...',
    onSearch: (q) => console.log('Searching ', q),
    renderSearchButton: true,
    styles: {
      wrapper: 'search-bar__wrapper',
      input: 'search-bar__input',
      submitButton: 'react-search-bar__submit',
    },
};

export default SearchInput
