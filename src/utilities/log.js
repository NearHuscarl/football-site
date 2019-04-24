/* eslint-disable no-console */
class Log {
	static error(message) {
		console.log(`%c${message}`, 'background: #E74C3C; color: #ffffff');
	}

	static warning(message) {
		console.log(`%c${message}`, 'background: #F1C40F; color: #000000');
	}

	static info(message) {
		console.log(`%c${message}`, 'background: #3498DB; color: white');
	}

	static debug(message) {
		console.log(`%c${message}`, 'color: #1ABC9C');
	}
}

export default Log;