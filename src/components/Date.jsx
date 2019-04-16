import React from 'react';
import { SingleDatePicker } from 'react-dates';

class Date extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: null,
		};
    }

    onFocusChange = ({ focused }) => {
        this.setState(() => ({ focused }));
    }

    render() {
        return (
            <div className="date-wrapper">
                <SingleDatePicker
                    id=''
                    focused={this.state.focused}
                    onFocusChange={this.onFocusChange}
                    isOutsideRange={(day) => false}
                    numberOfMonths={1}
                    {...this.props}
                />
            </div>
        );
    }
}

export default Date;