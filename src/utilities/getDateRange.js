import moment from 'moment';

const getDateRange = (startDate, endDate, format = 'YYYY-MM-DD') => {
    if (!moment.isMoment(startDate) || !moment.isMoment(endDate)) {
        return [];
    }

    let dates = [];
    while (!startDate.isAfter(endDate, 'day')) {
        dates.push(startDate.format(format));
        startDate.add(1, 'days');
    }

    return dates;
};

export default getDateRange;