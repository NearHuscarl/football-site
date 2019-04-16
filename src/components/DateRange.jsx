import React from 'react';
import { DateRangePicker } from 'react-dates';

class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			focused: null,
		};
    }
    
	onFocusChange = (focused) => {
		this.setState(() => ({ focused }));
	};

    render() {
        return (
            <div className="date-wrapper">
                <DateRangePicker
                    startDateId=''
                    endDateId=''
                    focusedInput={this.state.focused}
                    onFocusChange={this.onFocusChange}
                    showClearDates={true}
                    numberOfMonths={1}
                    isOutsideRange={(day) => false}
                    {...this.props}
                />
            </div>
        );
    }
}

export default DateRange;