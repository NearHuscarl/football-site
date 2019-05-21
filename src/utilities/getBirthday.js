import moment from 'moment';

/**
 * 
 * @param {number} age
 */
const getBirthday = (age) => moment().subtract(age, 'years').format('YYYY-MM-DD')

export default getBirthday;