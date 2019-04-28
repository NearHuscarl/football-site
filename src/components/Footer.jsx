import React from 'react';
import { repository } from '../../package.json';

class Footer extends React.Component {
	onClickSauce = () => {
		const win = window.open(repository.url, '_blank');
		win.focus();
	}

	render() {
		return (
			<div className='footer'>
				<div className='content-container'>
					<div className='footer__content'>
						<button
							type='button'
							className='button button--link'
							onClick={this.onClickSauce}>
							<i className='fa fa-github fa-fw fa-lg' />{' '}
							Source code
						</button>
					</div>
				</div>
			</div>
		);
	}
};

export default Footer;