import moment from 'moment';

/**
 * 
 * @param {string} birthday 'YYY-MM-DD' or ISO-8601 date format 
 */
const getAge = (birthday) => moment().diff(moment(birthday), 'years')

export default getAge;